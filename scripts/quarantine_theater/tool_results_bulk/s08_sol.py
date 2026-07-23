
# ========== S08 ==========

def s08_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 3, "encoding utf-8 evita depender del locale del SO (p.ej. Windows)."),
            sc(1, 1, "Escritura atomica: temp + os.replace al destino."),
            sc(2, 2, "Fila con columnas de mas va a cuarentena con motivo."),
            sc(3, 0, "Reconciliacion: n_in == n_clean + n_quarantine."),
            sc(4, 3, "Si reconcile falla: fail closed / exit non-zero."),
        ]
    return [
        sc(0, 3, "S08-T1-A: declarar encoding en open/read_text."),
        sc(1, 1, "Patron write_atomic del demo."),
        sc(2, 2, "S08-T2-B cuarentena de filas irregulares."),
        sc(3, 0, "Manifest de corrida exige balance de conteos."),
        sc(4, 3, "No publicar clean si reconcile_ok es False."),
    ]

def s08_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S08-T1-A-E1', 'from pathlib import Path\nimport tempfile\ntd = Path(tempfile.mkdtemp())\np = td / "intake.txt"\np.write_text("linea1\\njosé\\n", encoding="utf-8")\nprint(p.exists(), p.read_text(encoding="utf-8").splitlines())\n', 'pathlib write/read utf-8.' if A else 'exists + splitlines.', ['pathlib']))
    out.append(ex('S08-T1-A-E2', 'from pathlib import Path\nimport tempfile\np = Path(tempfile.mkdtemp()) / "a.txt"\nwith p.open("w", encoding="utf-8") as f:\n    f.write("hola\\n")\nprint(p.read_text(encoding="utf-8"))\n', 'with open encoding.' if A else 'context manager.', ['with']))
    out.append(ex('S08-T1-A-E3', 'from pathlib import Path\nimport tempfile\np = Path(tempfile.mkdtemp()) / "b.txt"\np.write_text("x", encoding="utf-8")\nprint(p.stat().st_size, p.resolve().name)\n', 'stat size + name.' if A else 'metadatos basicos.', ['stat']))
    out.append(ex('S08-T1-B-E1', 'from pathlib import Path\nimport os, tempfile\ndef write_atomic(path: Path, text: str) -> None:\n    path = Path(path)\n    tmp = path.with_name(path.name + ".tmp")\n    tmp.write_text(text, encoding="utf-8")\n    os.replace(tmp, path)\ndest = Path(tempfile.mkdtemp()) / "out.txt"\nwrite_atomic(dest, "hola\\n")\nprint(dest.read_text(encoding="utf-8"))\n', 'temp + os.replace atomico.' if A else 'escritura segura.', ['atomic']))
    out.append(ex('S08-T1-B-E2', 'sample = b"a\\r\\nb\\n"\nprint("tiene CRLF", b"\\r\\n" in sample)\ntext = sample.replace(b"\\r\\n", b"\\n").decode("utf-8")\nprint(text.splitlines())\n', 'normaliza newlines CRLF.' if A else 'ingesta portable.', ['newlines']))
    out.append(ex('S08-T1-B-E3', 'from pathlib import Path\nimport os, tempfile\ndef write_atomic(path, text):\n    path = Path(path)\n    tmp = path.with_suffix(path.suffix + ".tmp")\n    tmp.write_text(text, encoding="utf-8")\n    os.replace(tmp, path)\n    return path\nprint(write_atomic(Path(tempfile.mkdtemp())/"c.csv", "id\\n1\\n").name)\n', 'atomic csv write.' if A else 'suffix .tmp.', ['atomic']))
    out.append(ex('S08-T2-A-E1', 'import csv, io\nfrom decimal import Decimal\nraw = "id,nombre,monto\\nC001,Ana,10.5\\nC002,Luis,20\\n"\nfor row in csv.DictReader(io.StringIO(raw)):\n    row["monto"] = Decimal(row["monto"]).quantize(Decimal("0.01"))\n    print(row)\n', 'DictReader + Decimal monto.' if A else 'tipos al leer CSV.', ['csv']))
    out.append(ex('S08-T2-A-E2', 'import csv, io\nraw = "id,nombre\\nC001,Ana\\n"\nprint(list(csv.DictReader(io.StringIO(raw))))\n', 'headers del dialecto default.' if A else 'lista de dicts.', ['DictReader']))
    out.append(ex('S08-T2-A-E3', 'import csv, io\nfrom decimal import Decimal, InvalidOperation\ndef parse_monto(s):\n    try:\n        return Decimal(s).quantize(Decimal("0.01"))\n    except InvalidOperation:\n        return None\nraw = "id,monto\\nC1,10.5\\nC2,xx\\n"\nfor row in csv.DictReader(io.StringIO(raw)):\n    print(row["id"], parse_monto(row["monto"]))\n', 'monto invalido -> None sin tumbar lote.' if A else 'parse por celda.', ['parse']))
    out.append(ex('S08-T2-B-E1', 'import csv, io\ntext = "id,nombre\\nC001,Ana\\nC002,Luis,EXTRA\\nC003\\n"\nreader = csv.reader(io.StringIO(text))\nheader = next(reader)\ngood, bad = [], []\nfor row in reader:\n    if len(row) != len(header):\n        bad.append({"raw": row, "reason": f"cols {len(row)}!={len(header)}"})\n    else:\n        good.append(dict(zip(header, row)))\nprint("good", good)\nprint("bad", bad)\n', 'filas irregulares a cuarentena.' if A else 'motivo cols.', ['quarantine']))
    out.append(ex('S08-T2-B-E2', 'def quarantine_row(row, reason):\n    return {"raw": row, "reason": reason, "status": "quarantine"}\nprint(quarantine_row(["C1", "x", "y"], "cols 3!=2"))\n', 'estructura de cuarentena.' if A else 'no silenciar.', ['quarantine']))
    out.append(ex('S08-T2-B-E3', 'good, bad = [{"id": "C1"}], [{"raw": ["C2"], "reason": "cols"}]\nprint(len(good) + len(bad) == 2)\n', 'balance good+bad.' if A else 'trazabilidad de filas.', ['balance']))
    out.append(ex('S08-T3-A-E1', 'import json\nfrom datetime import date\ndata = [{"id": "T1", "dia": date(2026, 1, 15).isoformat()}]\ns = json.dumps(data, ensure_ascii=False, sort_keys=True)\nprint(s)\nprint(json.loads(s)[0]["id"])\n', 'dumps sort_keys + iso date.' if A else 'round-trip id.', ['json']))
    out.append(ex('S08-T3-A-E2', 'import json\nprint(json.loads(\'{"a":1,"b":null}\')["b"] is None)\n', 'null JSON -> None Python.' if A else 'schema nullable.', ['null']))
    out.append(ex('S08-T3-A-E3', 'import json\nobj = {"id": "C1"}\nobj.setdefault("segment", "default")\nprint(json.dumps(obj, sort_keys=True))\n', 'evolucion compatible setdefault.' if A else 'default de campo nuevo.', ['schema evo']))
    out.append(ex('S08-T3-B-E1', 'def validate_schema(obj, required):\n    missing = [k for k in required if k not in obj]\n    return (len(missing) == 0, missing)\nprint(validate_schema({"id": "C1", "email": None}, ["id", "email"]))\nprint(validate_schema({"id": "C1"}, ["id", "email"]))\n', 'required keys; null cuenta presente.' if A else 'missing list.', ['schema']))
    out.append(ex('S08-T3-B-E2', 'def is_compatible(old_keys, new_obj):\n    return all(k in new_obj for k in old_keys)\nprint(is_compatible(["id"], {"id": "x", "extra": 1}))\n', 'compat hacia adelante con extra fields.' if A else 'no romper lectores viejos.', ['compat']))
    out.append(ex('S08-T3-B-E3', 'record = {"id": "C1"}\nrecord.setdefault("email", None)\nprint(record)\n', 'null explicito vs ausente.' if A else 'setdefault email.', ['nulls']))
    out.append(ex('S08-T4-A-E1', 'from pathlib import Path\nimport hashlib, tempfile, shutil\ntd = Path(tempfile.mkdtemp())\nsrc = td / "clients.csv"\nsrc.write_text("id,nombre\\nC001,Ana\\n", encoding="utf-8")\nh = hashlib.sha256(src.read_bytes()).hexdigest()\nbak = td / "clients.csv.bak"\nshutil.copy2(src, bak)\nprint("sha256", h[:16] + "...")\nprint("bak exists", bak.exists())\n', 'hash + backup copy2.' if A else 'provenance basica.', ['hash']))
    out.append(ex('S08-T4-A-E2', 'import hashlib\nb = b"hello"\nprint(hashlib.sha256(b).hexdigest()[:12])\n', 'sha256 corto para manifest.' if A else 'fingerprint contenido.', ['sha256']))
    out.append(ex('S08-T4-A-E3', 'provenance = {"path": "clients.csv", "sha256": "abc", "bytes": 12}\nprint(provenance)\n', 'registro de provenance.' if A else 'path+hash+bytes.', ['provenance']))
    out.append(ex('S08-T4-B-E1', 'sources = [\n    {"name": "clients.csv", "n_in": 6, "n_clean": 5, "n_quarantine": 1},\n    {"name": "transactions.json", "n_in": 4, "n_clean": 3, "n_quarantine": 1},\n]\nfor source in sources:\n    source["reconcile_ok"] = source["n_in"] == source["n_clean"] + source["n_quarantine"]\nprint(sources)\nprint(all(s["reconcile_ok"] for s in sources))\n', 'n_in == clean + quarantine.' if A else 'reconcile_ok.', ['reconcile']))
    out.append(ex('S08-T4-B-E2', 'def fail_closed(reconcile_ok):\n    if not reconcile_ok:\n        raise SystemExit(1)\n    return 0\nprint(fail_closed(True))\n', 'fail closed si reconcile falla.' if A else 'exit non-zero.', ['fail closed']))
    out.append(ex('S08-T4-B-E3', 'manifest = {\n    "n_in": 10, "n_clean": 8, "n_quarantine": 2,\n    "reconcile_ok": 10 == 8 + 2,\n}\nprint(manifest)\nif not manifest["reconcile_ok"]:\n    raise SystemExit("reconcile failed")\nprint("publish_ok")\n', 'manifest de corrida + publish solo si ok.' if A else 'contrato de ingesta.', ['manifest']))
    return out
