#!/usr/bin/env python3
"""CP-N1-B: pruebas de tu cp_n1_b.py. Ejecuta:  python3 tests/test_demo.py

Cada valor esperado se calculó a mano desde BRIEF.md y data/generate.py, nunca copiando la salida
del código. Al principio fallan todas: cada fallo dice qué función escribir y qué regla mirar.
"""
import hashlib
import json
import os
import sys
import traceback
from pathlib import Path

from _select import DATA, LOCATION, carpeta_temporal, error_de, generate, impl

SHA256_ABC = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"


def igual(obtenido, esperado, que):
    """Falla con lo que se comprobaba, lo que salió y lo que se esperaba."""
    if obtenido != esperado:
        raise AssertionError(f"{que}\n           obtenido: {obtenido!r}\n           esperado: {esperado!r}")


def fuente(name, n_in, n_clean, n_quarantine):
    return {"name": name, "sha256": "0" * 64, "n_in": n_in, "n_clean": n_clean,
            "n_quarantine": n_quarantine}


def test_01_sha256_del_crudo():
    """regla 1: el hash es de los bytes del archivo; un byte distinto da otro hash"""
    d = carpeta_temporal()
    (d / "a.txt").write_bytes(b"abc")
    igual(impl.sha256_file(d / "a.txt"), SHA256_ABC, "sha256_file de un archivo con b'abc'")
    (d / "b.txt").write_bytes(b"abd")
    assert impl.sha256_file(d / "b.txt") != SHA256_ABC, "b'abd' dio el mismo hash que b'abc'"


def test_02_escritura_atomica():
    """regla 2: escribe en un temporal junto al destino, lo publica con os.replace, usa LF y no deja .tmp"""
    d = carpeta_temporal()
    destino = d / "out.txt"
    destino.write_text("viejo\n", encoding="utf-8")
    movidos = []
    replace_real = os.replace

    def espia(src, dst):  # el mismo espía del We Do de T1-B
        movidos.append((Path(src), Path(dst)))
        replace_real(src, dst)

    os.replace = espia
    try:
        impl.write_atomic(destino, "nuevo\nlinea\n")
    finally:
        os.replace = replace_real
    igual(destino.read_bytes(), b"nuevo\nlinea\n", "contenido de out.txt (con saltos LF)")
    assert movidos, "write_atomic no llamó a os.replace: escribió directo sobre el destino"
    tmp, dst = movidos[0]
    igual(Path(dst).name, "out.txt", "destino de os.replace")
    igual(tmp.parent, destino.parent, "carpeta del temporal (debe ser la del destino)")
    assert tmp.name != "out.txt.tmp", "el temporal tiene un nombre fijo; usa tempfile.mkstemp"
    igual(sorted(p.name for p in d.iterdir()), ["out.txt"], "archivos en la carpeta (quedó un temporal)")


def test_03_montos_como_texto_decimal():
    """regla 3: solo texto con dígitos y un punto; dos decimales; nunca float"""
    casos = [("10.5", "10.50"), ("0", "0.00"), ("20", "20.00"), ("12.345", "12.34"),
             ("10,50", None), ("abc", None), ("", None), ("1.2.3", None), ("-5", None),
             ("١٢", None), (12.5, None), (None, None)]
    for valor, esperado in casos:
        igual(impl.monto_texto(valor), esperado, f"monto_texto({valor!r})")


def test_04_clientes_csv_limpios_y_cuarentena():
    """regla 4: 8 registros → 4 limpios, 4 en cuarentena con su motivo; 1 línea vacía aparte"""
    clean, quarantine, stats = impl.load_clients_csv(DATA / "clients.csv")
    igual(stats, {"n_in": 8, "n_clean": 4, "n_quarantine": 4, "n_blank_ignored": 1}, "stats de clients.csv")
    igual([r["id"] for r in clean], ["C001", "C002", "C003", "C008"], "ids limpios")
    igual([r["monto"] for r in clean], ["10.50", "20.00", "0.00", "7.50"], "montos limpios")
    igual(clean[1]["nombre"], "Quispe, Rosa", "nombre de C002 (la coma va entre comillas)")
    igual([(q["record_number"], q["reason"]) for q in quarantine],
          [(4, "col_count"), (5, "col_count"), (6, "cast_monto"), (7, "missing_key")],
          "(record_number, reason) de la cuarentena")
    igual(quarantine[0]["raw"], "C004,Carla Demo,10,50\n", "raw del registro 4")
    assert "parsed_row" not in quarantine[0], "el registro 4 tiene 4 columnas: no lleva parsed_row"
    assert "parsed_row" not in quarantine[1], "el registro 5 no tiene 3 columnas: no lleva parsed_row"
    igual(quarantine[2].get("parsed_row"), {"id": "C006", "nombre": "Marta Demo", "monto": "abc"},
          "parsed_row del registro 6")


def test_05_transacciones_json_schema_y_montos():
    """regla 5: 8 elementos → 3 limpios; schema, missing_key y cast_monto van a cuarentena"""
    igual(impl.validate_schema({"id": "T1", "client_id": "C1", "monto": "1"}, impl.TRANSACTION_KEYS),
          (True, []), "validate_schema de un objeto completo")
    igual(impl.validate_schema({"id": "T1", "monto": None}, ("id", "monto")), (False, ["monto"]),
          "validate_schema con monto null")
    igual(impl.validate_schema("T7", ("id",)), (False, ["id"]), "validate_schema de un texto")
    clean, quarantine, stats = impl.load_transactions_json(DATA / "transactions.json")
    igual(stats, {"n_in": 8, "n_clean": 3, "n_quarantine": 5, "n_blank_ignored": 0}, "stats de transactions.json")
    igual(clean, [{"id": "T001", "client_id": "C001", "monto": "5.00"},
                  {"id": "T002", "client_id": "C002", "monto": "12.34"},
                  {"id": "T003", "client_id": "C003", "monto": "0.00"}], "transacciones limpias")
    igual([(q["record_number"], q["reason"]) for q in quarantine],
          [(4, "cast_monto"), (5, "missing_key"), (6, "missing_key"), (7, "schema"), (8, "cast_monto")],
          "(record_number, reason) de la cuarentena")
    igual(quarantine[3]["raw"], '"T007"', "raw del elemento 7 (JSON con claves ordenadas)")


def test_06_reconciliacion_por_fuente():
    """regla 6: cada fuente cuadra por separado; un sobrante no compensa un faltante"""
    igual(impl.fuentes_rotas([fuente("clients.csv", 3, 1, 1)]), ["clients.csv"], "fuentes_rotas de 3 = 1 + 1")
    compensadas = [fuente("clients.csv", 3, 3, 1), fuente("transactions.json", 3, 1, 1)]
    igual(impl.fuentes_rotas(compensadas), ["clients.csv", "transactions.json"],
          "fuentes_rotas cuando un sobrante compensa un faltante")
    igual(error_de(impl.build_manifest, run_id="r", sources=compensadas), "ValueError",
          "build_manifest con fuentes que no cuadran")
    duplicadas = [fuente("a.csv", 1, 1, 0), fuente("a.csv", 1, 1, 0)]
    igual(error_de(impl.build_manifest, run_id="r", sources=duplicadas), "ValueError",
          "build_manifest con dos fuentes del mismo nombre")
    m = impl.build_manifest(run_id="r1", sources=[fuente("z.json", 2, 2, 0), fuente("a.csv", 5, 3, 2)])
    igual([s["name"] for s in m["sources"]], ["a.csv", "z.json"], "orden de las fuentes")
    igual((m["run_id"], m["n_in"], m["n_clean"], m["n_quarantine"], m["reconcile_ok"]),
          ("r1", 7, 5, 2, True), "(run_id, n_in, n_clean, n_quarantine, reconcile_ok)")
    igual([s["reconcile_ok"] for s in m["sources"]], [True, True], "reconcile_ok de cada fuente")


def test_07_corrida_publica_todo():
    """regla 7: run devuelve 0 y publica clean, quarantine, manifest y respaldos del run_id"""
    out = carpeta_temporal()
    igual(impl.run(DATA, out, run_id="corrida1"), 0, "valor que devuelve run")
    m = json.loads((out / "manifest.json").read_text(encoding="utf-8"))
    igual((m["run_id"], m["n_in"], m["n_clean"], m["n_quarantine"]), ("corrida1", 16, 7, 9),
          "(run_id, n_in, n_clean, n_quarantine) del manifest")
    for s in m["sources"]:
        crudo = (DATA / s["name"]).read_bytes()
        igual(s["sha256"], hashlib.sha256(crudo).hexdigest(), f"sha256 de {s['name']} en el manifest")
        respaldo = out / "backups" / "corrida1" / s["name"]
        assert respaldo.exists(), f"falta el respaldo {respaldo}"
        assert respaldo.read_bytes() == crudo, f"el respaldo {s['name']} no es el crudo byte a byte"
    clientes = (out / "clean" / "clients.csv").read_text(encoding="utf-8").splitlines()
    igual(clientes[:1], ["id,nombre,monto"], "encabezado de clean/clients.csv")
    igual(len(clientes), 5, "líneas de clean/clients.csv (encabezado y 4 filas)")
    tx = json.loads((out / "clean" / "transactions.json").read_text(encoding="utf-8"))
    igual([type(t["monto"]).__name__ for t in tx], ["str", "str", "str"], "tipo de cada monto en clean/transactions.json")
    lineas = (out / "quarantine" / "transactions.jsonl").read_text(encoding="utf-8").splitlines()
    igual([json.loads(x)["reason"] for x in lineas],
          ["cast_monto", "missing_key", "missing_key", "schema", "cast_monto"], "motivos en quarantine/transactions.jsonl")


def test_08_cada_registro_tiene_un_solo_destino():
    """proveniencia: cada id de entrada aparece una sola vez, en clean o en quarantine de su fuente"""
    out = carpeta_temporal()
    igual(impl.run(DATA, out, run_id="r"), 0, "valor que devuelve run")
    limpias = (out / "clean" / "clients.csv").read_text(encoding="utf-8").splitlines()[1:]
    q = (out / "quarantine" / "clients.jsonl").read_text(encoding="utf-8").splitlines()
    ids_salida = [x.split(",")[0] for x in limpias] + [json.loads(x)["raw"].split(",")[0] for x in q]
    igual(sorted(ids_salida), ["C001", "C002", "C003", "C004", "C005", "C006", "C007", "C008"],
          "ids de clients.csv entre clean y quarantine (cada uno una vez)")


def test_09_repetir_la_corrida_da_las_mismas_salidas():
    """idempotencia: dos corridas dan los mismos archivos; solo cambia el run_id del manifest"""
    a, b = carpeta_temporal(), carpeta_temporal()
    igual((impl.run(DATA, a), impl.run(DATA, b)), (0, 0), "valor que devuelve cada corrida")
    for rel in ("clean/clients.csv", "clean/transactions.json", "quarantine/clients.jsonl",
                "quarantine/transactions.jsonl"):
        assert (a / rel).read_bytes() == (b / rel).read_bytes(), f"{rel} cambió entre dos corridas"
    ma = json.loads((a / "manifest.json").read_text(encoding="utf-8"))
    mb = json.loads((b / "manifest.json").read_text(encoding="utf-8"))
    assert ma["run_id"] != mb["run_id"], f"las dos corridas usaron el mismo run_id {ma['run_id']!r}"
    assert len(ma["run_id"]) == 32 and all(c in "0123456789abcdef" for c in ma["run_id"]), \
        f"run_id {ma['run_id']!r} no es uuid.uuid4().hex"
    assert (a / "backups" / ma["run_id"]).is_dir(), "los respaldos no están en backups/{run_id}"
    ma.pop("run_id"), mb.pop("run_id")
    igual(ma, mb, "manifest de la segunda corrida, sin run_id, frente al de la primera")


def test_10_una_fuente_ilegible_no_publica_nada():
    """falla cerrada: un JSON roto, un encabezado distinto o un run_id con ../ detienen la corrida sin publicar"""
    for nombre, contenido in [("transactions.json", '[{"id": "T1",'),
                              ("clients.csv", "id,name,amount\nC001,Ana,1\n")]:
        datos = carpeta_temporal()
        generate.write(datos)
        (datos / nombre).write_text(contenido, encoding="utf-8")
        out = carpeta_temporal()
        assert error_de(impl.run, datos, out) is not None, f"{nombre} roto no detuvo la corrida"
        igual(sorted(p.name for p in out.iterdir()), [], f"lo publicado en out/ con {nombre} roto")
    for run_id in ("../fuera", "a/b", "/tmp/fuera"):
        base = carpeta_temporal()
        out = base / "out"
        out.mkdir()
        igual(error_de(impl.run, DATA, out, run_id=run_id), "ValueError", f"run con run_id={run_id!r}")
        igual(sorted(p.name for p in base.rglob("*")), ["out"], f"lo escrito con run_id={run_id!r}")


def test_11_los_datos_son_los_del_generador():
    """data/: los dos archivos son exactamente los que escribe data/generate.py"""
    d = carpeta_temporal()
    generate.write(d)
    for nombre in ("clients.csv", "transactions.json"):
        assert (d / nombre).read_bytes() == (DATA / nombre).read_bytes(), \
            f"data/{nombre} no es lo que escribe data/generate.py: vuelve a ejecutarlo"
        igual(impl.sha256_file(d / nombre), impl.sha256_file(DATA / nombre), f"sha256 de {nombre}")


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
