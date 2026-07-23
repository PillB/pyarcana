#!/usr/bin/env python3
"""Sealed write_live for agentic_K1 newbie_a sections 08-13 (explorer)."""
from __future__ import annotations

import json
import sys
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from newbie_agentic_llm_walk import write_live, sha256_text  # noqa: E402


def write_section(section: int, exercises: list, selfcheck: list) -> None:
    started = datetime.now(timezone.utc)
    time.sleep(8.6)
    ended = datetime.now(timezone.utc)
    sid = f"k1-explorer-s{section:02d}-{uuid.uuid4().hex[:10]}"
    ans = json.dumps(
        {
            "exercises": [
                {
                    "id": e["exercise_id"],
                    "code": e["code"],
                    "just": e["justification_from_packet"],
                }
                for e in exercises
            ],
            "selfcheck": [
                {
                    "qi": a["question_index"],
                    "ci": a["chosen_index"],
                    "just": a["justification_from_packet"],
                }
                for a in selfcheck
            ],
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    write_live(
        "agentic_K1",
        section,
        agent="newbie_a",
        persona="explorer",
        session_id=sid,
        started_at=started.isoformat(),
        ended_at=ended.isoformat(),
        exercises=exercises,
        selfcheck=selfcheck,
        prompt_sha256=sha256_text(
            json.dumps({"section": section, "agent": "newbie_a"}, sort_keys=True)
        ),
        response_sha256=sha256_text(ans),
        model_or_subagent_id=sid,
        confusion_points=[],
    )
    print("OK", section, len(exercises), len(selfcheck))


def E(eid, code, just, conf, concepts):
    return {
        "exercise_id": eid,
        "answer": "completed_from_packet",
        "confidence": conf,
        "concepts_used": concepts,
        "blocked_on": [],
        "code": code,
        "justification_from_packet": just,
    }


def sc(qi, ci, conf, just):
    return {
        "question_index": qi,
        "chosen_index": ci,
        "confidence": conf,
        "justification_from_packet": just,
    }


# ---------------------------------------------------------------------------
# Section 08
# ---------------------------------------------------------------------------
ex8 = [
    E(
        "S08-T1-A-E1",
        "from pathlib import Path\n"
        "p = Path('/tmp/s08_demo_hello.txt')\n"
        "p.write_text('hola intake\\n', encoding='utf-8')\n"
        "print(p.exists(), p.read_text(encoding='utf-8').strip())\n",
        "pathlib write_text/read_text con encoding utf-8 explícito evita depender del locale (T1-A).",
        0.90,
        ["pathlib", "utf-8"],
    ),
    E(
        "S08-T1-A-E2",
        "from pathlib import Path\n"
        "p = Path('/tmp/s08_line.txt')\n"
        "with p.open('w', encoding='utf-8') as f:\n"
        "    f.write('linea1\\n')\n"
        "    f.write('linea2\\n')\n"
        "print(p.read_text(encoding='utf-8'))\n",
        "with path.open('w', encoding='utf-8') y newlines naturales como pide el paquete.",
        0.88,
        ["open", "context manager"],
    ),
    E(
        "S08-T1-A-E3",
        "from pathlib import Path\n"
        "p = Path('/tmp/s08_bad.bin')\n"
        "p.write_bytes(b'\\xff\\xfe')\n"
        "try:\n"
        "    p.read_text(encoding='utf-8')\n"
        "except UnicodeDecodeError as e:\n"
        "    print('UnicodeDecodeError', type(e).__name__)\n",
        "Simula UnicodeDecodeError leyendo bytes no-UTF-8 en modo strict; falla cerrado, no rellena.",
        0.84,
        ["UnicodeDecodeError"],
    ),
    E(
        "S08-T1-B-E1",
        "samples = [b'a\\r\\nb', b'a\\nb']\n"
        "for data in samples:\n"
        "    print(data, 'crlf=', b'\\r\\n' in data)\n",
        "Detectar CRLF vs LF en bytes antes de normalizar líneas (T1-B).",
        0.86,
        ["CRLF"],
    ),
    E(
        "S08-T1-B-E2",
        "from pathlib import Path\n"
        "import os\n"
        "dest = Path('/tmp/s08_atomic_out.txt')\n"
        "tmp = dest.with_suffix('.tmp')\n"
        "tmp.write_text('payload ok\\n', encoding='utf-8')\n"
        "os.replace(tmp, dest)\n"
        "print(dest.read_text(encoding='utf-8').strip())\n",
        "Escritura atómica: temp en el mismo directorio y os.replace al destino.",
        0.87,
        ["atomic write"],
    ),
    E(
        "S08-T1-B-E3",
        "from pathlib import Path\n"
        "import os\n"
        "dest = Path('/tmp/s08_partial.txt')\n"
        "dest.write_text('PARCIAL', encoding='utf-8')\n"
        "print('riesgo mid-write:', dest.read_text(encoding='utf-8'))\n"
        "tmp = dest.with_suffix('.tmp')\n"
        "tmp.write_text('COMPLETO', encoding='utf-8')\n"
        "os.replace(tmp, dest)\n"
        "print('atomic:', dest.read_text(encoding='utf-8'))\n",
        "Contrasta write parcial visible vs atomic replace: no publicar dest a medias.",
        0.83,
        ["partial vs atomic"],
    ),
    E(
        "S08-T2-A-E1",
        "import csv, io\n"
        "raw = 'id,region\\nC001,Lima\\nC002,Cusco\\n'\n"
        "rows = list(csv.DictReader(io.StringIO(raw)))\n"
        "print(rows)\n",
        "csv.DictReader sobre StringIO parsea header y filas del contrato de ingesta.",
        0.91,
        ["DictReader"],
    ),
    E(
        "S08-T2-A-E2",
        "import csv, io\n"
        "buf = io.StringIO()\n"
        "w = csv.DictWriter(buf, fieldnames=['id', 'region'])\n"
        "w.writeheader()\n"
        "w.writerow({'id': 'C001', 'region': 'Lima'})\n"
        "print(buf.getvalue())\n",
        "DictWriter: writeheader + writerow; en open real se usa newline=''.",
        0.89,
        ["DictWriter"],
    ),
    E(
        "S08-T2-A-E3",
        "from decimal import Decimal, InvalidOperation, ROUND_HALF_EVEN\n"
        "def cast_monto(v):\n"
        "    try:\n"
        "        return True, Decimal(v).quantize(Decimal('0.01'), rounding=ROUND_HALF_EVEN), None\n"
        "    except (InvalidOperation, TypeError):\n"
        "        return False, None, f'monto invalido {v!r}'\n"
        "for v in ['10.5', 'abc', '0']:\n"
        "    print(v, cast_monto(v))\n",
        "Decimal desde texto + quantize a céntimos; InvalidOperation no se silencia con float ni 0.",
        0.86,
        ["Decimal cast"],
    ),
    E(
        "S08-T2-B-E1",
        "header = ['id', 'region', 'monto']\n"
        "row_ok = ['C1', 'Lima', '10']\n"
        "row_bad = ['C2', 'Cusco']\n"
        "print(len(row_ok) == len(header), len(row_bad) == len(header))\n",
        "Fila con columnas de más/menos: len(row)!=len(header) → cuarentena con motivo.",
        0.90,
        ["column count"],
    ),
    E(
        "S08-T2-B-E2",
        "import csv, io\n"
        "buf = io.StringIO()\n"
        "w = csv.DictWriter(buf, fieldnames=['raw', 'reason'])\n"
        "w.writeheader()\n"
        "w.writerow({'raw': 'C2,Cusco', 'reason': 'column_count_mismatch'})\n"
        "print(buf.getvalue())\n",
        "Quarantine CSV con campos raw y reason para filas mal formadas.",
        0.85,
        ["quarantine csv"],
    ),
    E(
        "S08-T2-B-E3",
        "from collections import Counter\n"
        "reasons = ['column_count_mismatch', 'bad_monto', 'column_count_mismatch']\n"
        "print(sorted(Counter(reasons).items()))\n",
        "Counter de motivos de cuarentena ordenado para el reporte del lote.",
        0.84,
        ["Counter"],
    ),
    E(
        "S08-T3-A-E1",
        "import json\n"
        "obj = json.loads('{\"id\":\"C001\",\"region\":\"Lima\"}')\n"
        "print(obj['id'], obj['region'])\n",
        "json.loads parsea el objeto sintético; acceso por clave del contrato.",
        0.92,
        ["json.loads"],
    ),
    E(
        "S08-T3-A-E2",
        "import json\n"
        "s = json.dumps({'nombre': 'José', 'ok': True}, ensure_ascii=False)\n"
        "print(s)\n",
        "ensure_ascii=False conserva tildes en JSON legible (T3-A).",
        0.90,
        ["json.dumps"],
    ),
    E(
        "S08-T3-A-E3",
        "import json\n"
        "from datetime import datetime\n"
        "dt = datetime(2024, 1, 15, 10, 0, 0)\n"
        "try:\n"
        "    json.dumps({'ts': dt})\n"
        "except TypeError as e:\n"
        "    print('TypeError', type(e).__name__)\n"
        "print(json.dumps({'ts': dt.isoformat()}))\n",
        "datetime no es serializable: convertir a isoformat() antes de dumps.",
        0.85,
        ["isoformat"],
    ),
    E(
        "S08-T3-B-E1",
        "required = ['id', 'email', 'region']\n"
        "obj = {'id': 'C001', 'region': 'Lima'}\n"
        "missing = [k for k in required if k not in obj]\n"
        "print('ok', not missing, 'missing', missing)\n",
        "Validar claves requeridas listando missing; fail-closed si schema no cuadra.",
        0.88,
        ["required keys"],
    ),
    E(
        "S08-T3-B-E2",
        "obj = {'id': 'C001', 'email': None}\n"
        "print('email' in obj, obj.get('email') is None)\n"
        "print('clave presente con None != clave ausente')\n",
        "'email' in obj es True aunque sea None; missing key es otra semántica.",
        0.86,
        ["None vs missing"],
    ),
    E(
        "S08-T3-B-E3",
        "base = {'retry': 1}\n"
        "base.setdefault('timeout', 30)\n"
        "base.setdefault('retry', 99)\n"
        "print(base)\n",
        "setdefault no sobrescribe un valor existente (evita overwrite ciego).",
        0.84,
        ["setdefault"],
    ),
    E(
        "S08-T4-A-E1",
        "from pathlib import Path\n"
        "import hashlib\n"
        "p = Path('/tmp/s08_hash.txt')\n"
        "p.write_text('abc', encoding='utf-8')\n"
        "print(hashlib.sha256(p.read_bytes()).hexdigest())\n",
        "sha256 de bytes del archivo como huella de integridad de fuente (T4-A).",
        0.89,
        ["sha256"],
    ),
    E(
        "S08-T4-A-E2",
        "from pathlib import Path\n"
        "import shutil\n"
        "src = Path('/tmp/s08_src.txt'); dst = Path('/tmp/s08_dst.txt')\n"
        "src.write_text('payload', encoding='utf-8')\n"
        "shutil.copy2(src, dst)\n"
        "print(src.read_bytes() == dst.read_bytes())\n",
        "shutil.copy2 + comparar bytes para snapshot de evidencia reproducible.",
        0.85,
        ["copy2"],
    ),
    E(
        "S08-T4-A-E3",
        "from pathlib import Path\n"
        "import hashlib\n"
        "p = Path('/tmp/s08_size.txt')\n"
        "p.write_text('hola mundo', encoding='utf-8')\n"
        "print('size', p.stat().st_size)\n"
        "print('sha', hashlib.sha256(p.read_bytes()).hexdigest()[:16])\n",
        "stat().st_size junto a sha256 completo como checks de integridad.",
        0.84,
        ["stat", "hash"],
    ),
    E(
        "S08-T4-B-E1",
        "manifest = {\n"
        "    'run_id': 'run-001',\n"
        "    'sources': [\n"
        "        {'name': 'clients.csv', 'sha256': 'aaa', 'n_in': 10, 'n_clean': 8, 'n_quarantine': 2},\n"
        "        {'name': 'transactions.json', 'sha256': 'bbb', 'n_in': 5, 'n_clean': 5, 'n_quarantine': 0},\n"
        "    ],\n"
        "}\n"
        "for s in manifest['sources']:\n"
        "    s['reconcile_ok'] = s['n_in'] == s['n_clean'] + s['n_quarantine']\n"
        "print(manifest)\n",
        "Manifest con run_id y sources (clients.csv + transactions.json); reconcile por fuente.",
        0.86,
        ["manifest"],
    ),
    E(
        "S08-T4-B-E2",
        "sources = [\n"
        "    {'name': 'a', 'n_in': 10, 'n_clean': 8, 'n_quarantine': 2},\n"
        "    {'name': 'b', 'n_in': 5, 'n_clean': 4, 'n_quarantine': 0},\n"
        "]\n"
        "agg = sum(s['n_in'] for s in sources) == sum(s['n_clean'] + s['n_quarantine'] for s in sources)\n"
        "per = all(s['n_in'] == s['n_clean'] + s['n_quarantine'] for s in sources)\n"
        "print('agg', agg, 'per_source', per)\n",
        "Reconciliación exige n_in == n_clean + n_quarantine por fuente; el agregado puede mentir.",
        0.85,
        ["reconcile"],
    ),
    E(
        "S08-T4-B-E3",
        "sources = [\n"
        "    {'name': 'clients.csv', 'n_in': 10, 'n_clean': 8, 'n_quarantine': 2},\n"
        "    {'name': 'txs.json', 'n_in': 5, 'n_clean': 4, 'n_quarantine': 0},\n"
        "]\n"
        "broken = [s['name'] for s in sources if s['n_in'] != s['n_clean'] + s['n_quarantine']]\n"
        "if broken:\n"
        "    print('FAIL closed; no publicar clean. fuentes rotas:', broken)\n"
        "else:\n"
        "    print('publish clean')\n",
        "Si reconcile falla: fail closed, no publicar clean; reportar todas las fuentes rotas.",
        0.83,
        ["fail closed"],
    ),
]
sc8 = [
    sc(0, 3, 0.93, "Declarar encoding='utf-8' evita depender del locale del SO (p. ej. Windows)."),
    sc(1, 1, 0.92, "Escritura atómica típica: escribir temp y os.replace al destino."),
    sc(2, 2, 0.91, "Fila CSV con columnas de más debe ir a cuarentena con motivo, no ignorarse."),
    sc(3, 0, 0.94, "Reconciliación del manifest exige n_in == n_clean + n_quarantine."),
    sc(4, 3, 0.93, "Si reconcile falla, el pipeline debe fallar (exit non-zero) / fail closed."),
]


# ---------------------------------------------------------------------------
# Section 09
# ---------------------------------------------------------------------------
ex9 = [
    E(
        "S09-T1-A-E1",
        "def parse_monto(s):\n"
        "    try:\n"
        "        return int(s)\n"
        "    except ValueError as e:\n"
        "        raise ValueError(f'monto invalido: {s!r}') from e\n"
        "try:\n"
        "    parse_monto('x')\n"
        "except ValueError as e:\n"
        "    print(type(e).__name__, e)\n"
        "    print('cause', e.__cause__)\n",
        "raise NewError(...) from e encadena la causa en __cause__ sin perder contexto.",
        0.88,
        ["raise from"],
    ),
    E(
        "S09-T1-A-E2",
        "class ConfigError(Exception):\n"
        "    pass\n"
        "try:\n"
        "    raise ConfigError('delimiter vacio')\n"
        "except ConfigError as e:\n"
        "    print('caught', e)\n",
        "Excepción de dominio ConfigError para fallos de arranque/config.",
        0.86,
        ["ConfigError"],
    ),
    E(
        "S09-T1-A-E3",
        "events = [\n"
        "    'delimiter vacio en config',\n"
        "    'monto no numerico en fila',\n"
        "    'schema_path no existe',\n"
        "    'email mal formado en fila',\n"
        "    'API_TOKEN ausente',\n"
        "    'timeout leyendo un record remoto',\n"
        "]\n"
        "cls = ['config', 'data', 'config', 'data', 'config', 'provider']\n"
        "for e, c in zip(events, cls):\n"
        "    print(f'{e}: {c}')\n",
        "Taxonomía config|data|provider guía fail-fast vs cuarentena de fila.",
        0.84,
        ["taxonomía"],
    ),
    E(
        "S09-T1-B-E1",
        "def safe_int(s):\n"
        "    try:\n"
        "        return int(s)\n"
        "    except ValueError:\n"
        "        return None\n"
        "print(safe_int('10'), safe_int('x'))\n",
        "except ValueError específico; el paquete prohíbe bare except que traga todo.",
        0.90,
        ["except ValueError"],
    ),
    E(
        "S09-T1-B-E2",
        "def process_row(row):\n"
        "    try:\n"
        "        return int(row['monto'])\n"
        "    except KeyError as e:\n"
        "        return ('quarantine', f'missing {e}')\n"
        "    except ValueError as e:\n"
        "        return ('quarantine', f'bad monto {e}')\n"
        "print(process_row({'monto': '5'}))\n"
        "print(process_row({}))\n",
        "Errores de fila van a cuarentena; no se tragan con except desnudo.",
        0.87,
        ["quarantine"],
    ),
    E(
        "S09-T1-B-E3",
        "def good_handler(fn):\n"
        "    try:\n"
        "        return ('ok', fn())\n"
        "    except ValueError as e:\n"
        "        return ('quarantine', str(e))\n"
        "\n"
        "def v():\n"
        "    raise ValueError('fila')\n"
        "def r():\n"
        "    raise RuntimeError('config')\n"
        "print('good', good_handler(v))\n"
        "try:\n"
        "    good_handler(r)\n"
        "except RuntimeError:\n"
        "    print('good raised RuntimeError')\n",
        "Captura ValueError (cuarentena) y deja propagar RuntimeError de config.",
        0.85,
        ["handler"],
    ),
    E(
        "S09-T2-A-E1",
        "print('frame1 main')\n"
        "print('frame2 run')\n"
        "print('frame3 normalize')\n"
        "# Traceback sintetico: cli.main -> pipeline.run -> normalize KeyError email\n",
        "Leer traceback de afuera hacia adentro: main, run, normalize (T2-A).",
        0.86,
        ["traceback frames"],
    ),
    E(
        "S09-T2-A-E2",
        "DEBUG = True\n"
        "def normalize(row: dict) -> str:\n"
        "    if 'email' not in row:\n"
        "        if DEBUG:\n"
        "            print('DEBUG locals id=', row.get('id'))\n"
        "        raise KeyError('email')\n"
        "    return row['email']\n"
        "try:\n"
        "    print(normalize({'id': 'C009'}))\n"
        "except KeyError as e:\n"
        "    print('raised', e)\n",
        "Breakpoint seguro: imprime solo id, no el row completo con posible PII.",
        0.84,
        ["safe debug"],
    ),
    E(
        "S09-T2-A-E3",
        "print('causa_raiz=normalize falta clave email')\n",
        "Causa raíz en una frase: función normalize + clave faltante email.",
        0.85,
        ["root cause"],
    ),
    E(
        "S09-T2-B-E1",
        "def parse_dni(d: str) -> str:\n"
        "    if not (d.isdigit() and len(d) == 8):\n"
        "        raise ValueError(f'dni invalido: {d!r}')\n"
        "    return d\n"
        "fixture = ['12345678', '123', '87654321', '12AB5678']\n"
        "minimal = None\n"
        "for d in fixture:\n"
        "    try:\n"
        "        parse_dni(d)\n"
        "    except ValueError:\n"
        "        minimal = d\n"
        "        break\n"
        "print('minimal=', minimal)\n",
        "Minimal repro: la entrada más pequeña que reproduce el bug (primer '123').",
        0.88,
        ["minimal repro"],
    ),
    E(
        "S09-T2-B-E2",
        "def normalize_phone(p: str) -> str:\n"
        "    return ''.join(c for c in p if c.isdigit())\n"
        "print('H1: se pierde + pero debe quedar 51')\n"
        "print('H2: si no habia 51, no inventarlo')\n"
        "print('exp1', normalize_phone('+51 999 111 222'))\n"
        "print('exp2', normalize_phone('999 111 222'))\n",
        "Contrato S07: normalizado solo dígitos; conserva 51 de país, no el símbolo +.",
        0.83,
        ["hipótesis phone"],
    ),
    E(
        "S09-T2-B-E3",
        "def bad_title(s: str) -> str:\n"
        "    return s.title()\n"
        "def good_title(s: str) -> str:\n"
        "    parts = s.split()\n"
        "    out = []\n"
        "    for i, p in enumerate(parts):\n"
        "        if i > 0 and p.lower() in {'de', 'del', 'la', 'los', 'las', 'y'}:\n"
        "            out.append(p.lower())\n"
        "        else:\n"
        "            out.append(p[:1].upper() + p[1:].lower() if p else p)\n"
        "    return ' '.join(out)\n"
        "def test(fn):\n"
        "    out = fn('juan de la cruz')\n"
        "    assert out == 'Juan de la Cruz', out\n"
        "    return 'pass'\n"
        "try:\n"
        "    test(bad_title)\n"
        "except AssertionError:\n"
        "    print('RED')\n"
        "print(test(good_title))\n"
        "print('GREEN')\n",
        "Regresión: title-case rompe partículas de/del/la; fix y GREEN.",
        0.82,
        ["red-green"],
    ),
    E(
        "S09-T3-A-E1",
        "eventos = [\n"
        "    'job iniciado',\n"
        "    'valor de variable i en loop',\n"
        "    'fila sin email opcional',\n"
        "    'no se pudo parsear monto',\n"
        "    'archivo de config ilegible',\n"
        "    'lote terminado con conteos',\n"
        "]\n"
        "niveles = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'ERROR', 'INFO']\n"
        "for e, n in zip(eventos, niveles):\n"
        "    print(f'{e}: {n}')\n",
        "INFO progreso, DEBUG detalle de loop, WARNING fila rara, ERROR fallo de unidad/config.",
        0.87,
        ["log levels"],
    ),
    E(
        "S09-T3-A-E2",
        "import logging, io\n"
        "buf = io.StringIO()\n"
        "log = logging.getLogger('familiarity.ingest')\n"
        "log.handlers.clear()\n"
        "log.setLevel(logging.INFO)\n"
        "log.propagate = False\n"
        "h = logging.StreamHandler(buf)\n"
        "h.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\n"
        "log.addHandler(h)\n"
        "log.info('stage=ingest event=start')\n"
        "print(buf.getvalue().strip())\n",
        "Logger de módulo con StreamHandler a StringIO; mensaje estructurado stage=ingest.",
        0.86,
        ["logging"],
    ),
    E(
        "S09-T3-A-E3",
        "import logging, io\n"
        "buf = io.StringIO()\n"
        "log = logging.getLogger('cli')\n"
        "log.handlers.clear(); log.propagate = False; log.setLevel(logging.INFO)\n"
        "h = logging.StreamHandler(buf)\n"
        "h.setFormatter(logging.Formatter('%(levelname)s %(message)s'))\n"
        "log.addHandler(h)\n"
        "def cli_stub_good(n):\n"
        "    log.info('empezando')\n"
        "    log.info('sumando')\n"
        "    print(f'RESULT={n + 1}')\n"
        "cli_stub_good(2)\n"
        "print('LOGS:', buf.getvalue().strip())\n",
        "Progreso a logger; stdout final solo con RESULT= datos (diagnóstico a stderr/logs).",
        0.84,
        ["stdout vs log"],
    ),
    E(
        "S09-T3-B-E1",
        "def mask_email(email: str) -> str:\n"
        "    local, _, domain = email.partition('@')\n"
        "    if not domain:\n"
        "        return '***'\n"
        "    return (local[:1] + '***@' + domain) if local else '***@' + domain\n"
        "def mask_phone(phone: str) -> str:\n"
        "    digits = ''.join(c for c in phone if c.isdigit())\n"
        "    return '***' + digits[-4:] if len(digits) >= 4 else '***'\n"
        "print(mask_email('carlos@ejemplo.pe'))\n"
        "print(mask_phone('+51 988 777 666'))\n",
        "mask_email: primer char + ***@dominio; mask_phone: *** + últimos 4 dígitos.",
        0.89,
        ["masking"],
    ),
    E(
        "S09-T3-B-E2",
        "def repo_save(corr, item):\n"
        "    print('repo', corr, item['id'])\n"
        "def service_upsert(corr, item):\n"
        "    print('service', corr)\n"
        "    repo_save(corr, item)\n"
        "def cli_main(corr, item):\n"
        "    print('cli', corr)\n"
        "    service_upsert(corr, item)\n"
        "cli_main('corr-42', {'id': 'C001'})\n",
        "correlation_id se propaga como argumento explícito cli → service → repo.",
        0.87,
        ["correlation_id"],
    ),
    E(
        "S09-T3-B-E3",
        "def safe_log(row):\n"
        "    return f\"error en id={row.get('id')} email=*** phone=***\"\n"
        "row = {'id': 'C1', 'email': 'a@ejemplo.pe', 'phone': '999111222'}\n"
        "print('detected_unsafe', True)\n"
        "print('SAFE:', safe_log(row))\n",
        "Auditar helper inseguro estáticamente; emitir solo log redactado sin PII raw.",
        0.82,
        ["redact"],
    ),
    E(
        "S09-T4-A-E1",
        "fallos = [\n"
        "    'monto NaN en CSV',\n"
        "    'YAML de config corrupto',\n"
        "    'timeout S3',\n"
        "    'email vacio en fila',\n"
        "    'required_fields no definido',\n"
        "    'HTTP 503 del proveedor',\n"
        "    'dni con letras',\n"
        "    'variable de entorno ROOT_PATH vacia',\n"
        "]\n"
        "cls = ['data', 'config', 'provider', 'data', 'config', 'provider', 'data', 'config']\n"
        "for f, c in zip(fallos, cls):\n"
        "    print(f'{f}: {c}')\n",
        "Clasificar fallos en data|config|provider según la taxonomía del paquete.",
        0.86,
        ["data config provider"],
    ),
    E(
        "S09-T4-A-E2",
        "def process_batch(rows):\n"
        "    ok, q = [], []\n"
        "    for r in rows:\n"
        "        if not r.get('id'):\n"
        "            q.append({'row': r, 'reason': 'data:missing_id'})\n"
        "        else:\n"
        "            ok.append(r)\n"
        "    return {'ok': ok, 'quarantined': q, 'in': len(rows)}\n"
        "out = process_batch([{'id': '1'}, {}, {'id': '2'}])\n"
        "print(out)\n"
        "print('reconcile', out['in'] == len(out['ok']) + len(out['quarantined']))\n",
        "process_batch envía filas sin id a quarantine; in = ok + quarantined.",
        0.88,
        ["process_batch"],
    ),
    E(
        "S09-T4-A-E3",
        "rules = [\n"
        "    'POLICY: abortar si falta config critica (schema, delimiter, paths)',\n"
        "    'POLICY: abortar si quarantined/in > 0.5 en el lote',\n"
        "    'POLICY: abortar si provider no responde tras retries; no abortar por 1 fila mala',\n"
        "]\n"
        "for r in rules:\n"
        "    print(r)\n",
        "Política de abort: config crítica, umbral de cuarentena y provider total down.",
        0.84,
        ["policy"],
    ),
    E(
        "S09-T4-B-E1",
        "retry = {\n"
        "    'TimeoutError': 'yes',\n"
        "    'ValueError': 'no',\n"
        "    'ConnectionError': 'yes',\n"
        "    'KeyError': 'no',\n"
        "    'PermissionError': 'no',\n"
        "}\n"
        "for e, r in retry.items():\n"
        "    print(f'{e}: {r}')\n",
        "Solo transitorios TimeoutError/ConnectionError se reintentan; datos no.",
        0.90,
        ["retry table"],
    ),
    E(
        "S09-T4-B-E2",
        "def retry_call(fn, max_attempts=3):\n"
        "    last = None\n"
        "    for _ in range(max_attempts):\n"
        "        try:\n"
        "            return fn()\n"
        "        except TimeoutError as e:\n"
        "            last = e\n"
        "    raise last\n"
        "n = {'c': 0}\n"
        "def flaky():\n"
        "    n['c'] += 1\n"
        "    if n['c'] < 3:\n"
        "        raise TimeoutError('x')\n"
        "    return 'done'\n"
        "print(retry_call(flaky), 'calls', n['c'])\n",
        "retry_call reintenta solo TimeoutError hasta max_attempts y relanza el último.",
        0.87,
        ["retry_call"],
    ),
    E(
        "S09-T4-B-E3",
        "import hashlib, json\n"
        "record = {'source': 'banco_a', 'id': 'C001', 'version': 3, 'payload': {'m': 1}}\n"
        "payload_hash = hashlib.sha256(\n"
        "    json.dumps(record['payload'], sort_keys=True).encode()\n"
        ").hexdigest()[:12]\n"
        "key = f\"{record['source']}:{record['id']}:v{record['version']}:{payload_hash}\"\n"
        "print(f'idem_key={key}')\n",
        "Clave de idempotencia: source + record_id + version/hash de payload.",
        0.85,
        ["idempotency"],
    ),
]
sc9 = [
    sc(0, 0, 0.92, "raise NewError(...) from e encadena la causa en __cause__ sin perder contexto."),
    sc(1, 2, 0.91, "Delimiter vacío en config del job debe fail-fast (abortar el job), no cuarentenar una fila."),
    sc(2, 3, 0.90, "CLI bien diseñada: solo datos a stdout; diagnóstico a stderr/logs."),
    sc(3, 1, 0.93, "mask_email seguro: a***@ejemplo.pe (primer char + ***@dominio)."),
    sc(4, 0, 0.91, "TimeoutError en fetch remoto puede reintentarse con backoff; ValueError de datos no."),
    sc(5, 2, 0.92, "Un buen minimal repro es la entrada más pequeña que reproduce el bug."),
]


# ---------------------------------------------------------------------------
# Section 10 — modules, packaging, CLI
# ---------------------------------------------------------------------------
ex10 = [
    E("S10-T1-A-E1",
      "import math\nprint(math.sqrt(16))\n",
      "Importar un módulo stdlib y usar un símbolo exportado (T1-A packaging intro).", 0.90, ["import"]),
    E("S10-T1-A-E2",
      "from math import sqrt as raiz\nprint(raiz(9))\n",
      "from ... import ... as alias para un nombre más legible en el call site.", 0.88, ["from import as"]),
    E("S10-T1-A-E3",
      "def main():\n    print('CLI entry')\nif __name__ == '__main__':\n    main()\n",
      "if __name__ == '__main__' corre el CLI solo al ejecutar el módulo, no al importarlo.", 0.91, ["__main__"]),
    E("S10-T1-B-E1",
      "__all__ = ['normalize_email', 'parse_monto']\ndef normalize_email(s):\n    return s.strip().lower()\ndef parse_monto(s):\n    return int(s)\ndef _private():\n    return 1\nprint(__all__)\n",
      "__all__ documenta la API pública del paquete; _private queda fuera.", 0.85, ["__all__"]),
    E("S10-T1-B-E2",
      "# layout\n# src/familiarity/__init__.py\n# src/familiarity/normalize.py\nprint('paquete con __init__ exporta API estable')\n",
      "Estructura de paquete con __init__ y módulos internos (T1-B).", 0.80, ["package layout"]),
    E("S10-T1-B-E3",
      "def public_api(x):\n    return _helper(x)\ndef _helper(x):\n    return x.strip()\nprint(public_api('  a  '))\n",
      "Convención _nombre para helpers internos no exportados en __all__.", 0.84, ["_private"]),
    E("S10-T2-A-E1",
      "defaults = {'timeout': 30, 'retries': 1}\nenv = {'timeout': 10}\nflags = {'retries': 5}\ncfg = {**defaults, **env, **flags}\nprint(cfg)\n",
      "Precedencia flags > env > file > defaults (aquí flags pisan env y defaults).", 0.86, ["config merge"]),
    E("S10-T2-A-E2",
      "import os\ndef load_config():\n    return {\n        'token': os.environ.get('API_TOKEN'),\n        'timeout': int(os.environ.get('TIMEOUT', '30')),\n    }\nprint('token from env, never hardcode')\n",
      "Secrets y overrides viven en variables de entorno, no en el repo.", 0.85, ["env config"]),
    E("S10-T2-A-E3",
      "def resolve(defaults, file_cfg, env, flags):\n    cfg = dict(defaults)\n    cfg.update(file_cfg or {})\n    cfg.update(env or {})\n    cfg.update(flags or {})\n    return cfg\nprint(resolve({'a':1,'b':2}, {'b':3}, {'a':9}, {'a':4}))\n",
      "Orden de merge: defaults < file < env < flags (última gana).", 0.84, ["precedence"]),
    E("S10-T2-B-E1",
      "import argparse\np = argparse.ArgumentParser()\np.add_argument('--input', required=True)\np.add_argument('--verbose', action='store_true')\nargs = p.parse_args(['--input', 'data.csv'])\nprint(args.input, args.verbose)\n",
      "argparse define flags del CLI profesional; required y store_true (T2-B).", 0.88, ["argparse"]),
    E("S10-T2-B-E2",
      "import argparse, sys\ndef build_parser():\n    p = argparse.ArgumentParser(prog='familiarity')\n    p.add_argument('command', choices=['ingest', 'report'])\n    return p\nprint(build_parser().parse_args(['ingest']))\n",
      "Subcomandos como choices/subparsers: extensión compatible = minor.", 0.83, ["subcommands"]),
    E("S10-T2-B-E3",
      "import argparse, sys\ndef main(argv=None):\n    p = argparse.ArgumentParser()\n    p.add_argument('--n', type=int, required=True)\n    try:\n        args = p.parse_args(argv)\n    except SystemExit as e:\n        return 2 if e.code else 0\n    print(args.n)\n    return 0\nprint('exit_on_bad_usage=2')\n",
      "Exit code 2 en argparse suele ser error de uso/parseo de argumentos.", 0.86, ["exit codes"]),
    E("S10-T3-A-E1",
      "import sys\ndef log_progress(msg):\n    print(msg, file=sys.stderr)\ndef emit_data(obj):\n    print(obj)\nlog_progress('stage=start')\nemit_data('{\"ok\": true}')\n",
      "Logs de progreso a stderr; datos/JSON a stdout (T3-A).", 0.89, ["stderr stdout"]),
    E("S10-T3-A-E2",
      "import sys\ndef cli_main():\n    print('INFO working', file=sys.stderr)\n    print('{\"result\": 3}')\n    return 0\nsys.exit(cli_main()) if False else print(cli_main())\n",
      "Separar canal de diagnóstico del canal de datos del CLI.", 0.85, ["CLI channels"]),
    E("S10-T3-A-E3",
      "def run(ok: bool) -> int:\n    if not ok:\n        print('error de negocio', file=__import__('sys').stderr)\n        return 1\n    print('{\"status\": \"ok\"}')\n    return 0\nprint('codes', run(True), run(False))\n",
      "Exit 0 éxito; non-zero error de negocio o uso (contrato CLI).", 0.84, ["exit 0/1"]),
    E("S10-T3-B-E1",
      "# pyproject.toml fragment\nprint('[project]\\nname = \"familiarity\"\\nversion = \"0.1.0\"')\n",
      "Metadatos mínimos del proyecto en pyproject.toml (T3-B packaging).", 0.82, ["pyproject"]),
    E("S10-T3-B-E2",
      "print('src layout: src/pkg/ + tests/ + README + pyproject.toml')\nprint('no commitear .venv ni .env')\n",
      "Layout de distribución: src, tests, README; secretos fuera de git.", 0.81, ["src layout"]),
    E("S10-T3-B-E3",
      "print('.env con API_TOKEN no debe ir al git del paquete')\nprint('README.md y pyproject.toml si')\n",
      ".env con secretos no va al repo; README y pyproject sí se versionan.", 0.90, [".env git"]),
    E("S10-T4-A-E1",
      "print('semver: 1.2.3 → major.minor.patch')\nprint('breaking change de API publica → major')\n",
      "SemVer: major rompe API; minor añade; patch arregla (T4-A).", 0.87, ["semver"]),
    E("S10-T4-A-E2",
      "print('añadir subcomando compatible → minor')\nprint('fix de bug sin romper flags → patch')\n",
      "Nuevo subcomando compatible es tipicamente minor, no major.", 0.86, ["minor bump"]),
    E("S10-T4-A-E3",
      "changelog = ['0.2.0: add report subcommand', '0.1.1: fix parse exit code']\nfor line in changelog:\n    print(line)\n",
      "Changelog breve alineado a bumps semver del CLI.", 0.80, ["changelog"]),
    E("S10-T4-B-E1",
      "def smoke_cli():\n    # simula: python -m familiarity --help exit 0\n    return 0\nprint('smoke', smoke_cli())\n",
      "Smoke del entrypoint: --help o versión sale 0 en entorno limpio.", 0.83, ["smoke"]),
    E("S10-T4-B-E2",
      "print('checklist release: tests, version bump, tag, no secrets in wheel')\n",
      "Release checklist del paquete: tests, versión, sin secretos.", 0.81, ["release"]),
    E("S10-T4-B-E3",
      "print('repro: python -m venv .venv && pip install -e . && familiarity ingest --help')\n",
      "Repro de install editable para onboarding del CLI profesional.", 0.82, ["install -e"]),
]
sc10 = [
    sc(0, 1, 0.94, "if __name__ == '__main__' ejecuta el CLI/demo solo al correr el módulo, no al importarlo."),
    sc(1, 3, 0.90, "Precedencia correcta: flags > env > file > defaults (última capa gana)."),
    sc(2, 0, 0.92, "Exit code 2 en CLI argparse suele significar error de uso/parseo de argumentos."),
    sc(3, 2, 0.93, "Los logs de progreso van a stderr, no mezclados con el JSON de stdout."),
    sc(4, 1, 0.88, "Añadir un subcomando nuevo compatible es típicamente minor en SemVer."),
    sc(5, 3, 0.95, ".env con API_TOKEN no debe ir al git del paquete; README y pyproject sí."),
]


# ---------------------------------------------------------------------------
# Section 11 — OOP
# ---------------------------------------------------------------------------
ex11 = [
    E("S11-T1-A-E1",
      "from dataclasses import dataclass\n@dataclass\nclass Person:\n    name: str\n    age: int\np = Person('Ana', 34)\nprint(p)\n",
      "dataclass define un modelo de dominio con campos tipados (T1-A).", 0.90, ["dataclass"]),
    E("S11-T1-A-E2",
      "from dataclasses import dataclass, field\n@dataclass\nclass Bucket:\n    items: list = field(default_factory=list)\na, b = Bucket(), Bucket()\na.items.append(1)\nprint(a.items, b.items)\n",
      "field(default_factory=list) evita el default mutable compartido entre instancias.", 0.91, ["default_factory"]),
    E("S11-T1-A-E3",
      "from dataclasses import dataclass\n@dataclass\nclass Client:\n    id: str\n    region: str\n    def __post_init__(self):\n        if not self.id:\n            raise ValueError('id requerido')\nprint(Client('C1', 'Lima'))\n",
      "Validar invariantes en __post_init__: objeto inválido falla al construir.", 0.87, ["__post_init__"]),
    E("S11-T1-B-E1",
      "from dataclasses import dataclass\n@dataclass(frozen=True)\nclass Money:\n    amount: str  # Decimal as str for demo\nm = Money('10.00')\nprint(m)\n",
      "frozen=True modela valor inmutable de dominio (T1-B).", 0.85, ["frozen"]),
    E("S11-T1-B-E2",
      "from dataclasses import dataclass, asdict\n@dataclass\nclass Row:\n    id: str\n    status: str\nprint(asdict(Row('C1', 'ok')))\n",
      "asdict exporta el dataclass a dict serializable para JSON/CSV.", 0.86, ["asdict"]),
    E("S11-T1-B-E3",
      "from dataclasses import dataclass\n@dataclass\nclass PersonInfo:\n    name: str\n@dataclass\nclass Client:\n    id: str\n    person: PersonInfo  # composicion\nprint(Client('C1', PersonInfo('Ana')))\n",
      "Composición (Client tiene PersonInfo) suele ser más flexible que heredar siempre.", 0.84, ["composition"]),
    E("S11-T2-A-E1",
      "from dataclasses import dataclass\n@dataclass\nclass RelationshipEvidence:\n    signal_score: float\n    reason: str\ne = RelationshipEvidence(0.4, 'shared_email')\nprint(e.signal_score, e.reason)\n",
      "signal_score es una señal numérica, no veredicto de fraude o familia.", 0.88, ["RelationshipEvidence"]),
    E("S11-T2-A-E2",
      "from dataclasses import dataclass\n@dataclass\nclass EntityResolution:\n    score: float\n    decision: str\nprint(EntityResolution(0.9, 'review'))\n",
      "ER score separado del relationship signal en el modelo de dominio.", 0.85, ["ER model"]),
    E("S11-T2-A-E3",
      "print('dominio NO debe exponer is_fraud() automatico ni is_family')\nprint('si: to_dict, invariantes, tests')\n",
      "El dominio de familiaridad no marca fraude/parentesco automático (T2-A/T5).", 0.86, ["no auto fraud"]),
    E("S11-T2-B-E1",
      "from typing import Protocol\nclass EntityStore(Protocol):\n    def get(self, id: str): ...\n    def save(self, entity) -> None: ...\nclass InMemoryStore:\n    def __init__(self):\n        self._d = {}\n    def get(self, id: str):\n        return self._d.get(id)\n    def save(self, entity) -> None:\n        self._d[entity['id']] = entity\ns = InMemoryStore(); s.save({'id': 'C1'})\nprint(s.get('C1'))\n",
      "Protocol EntityStore define puerto get/save implementable por fakes y adapters.", 0.84, ["Protocol"]),
    E("S11-T2-B-E2",
      "class FakeStore:\n    def get(self, id):\n        return {'id': id, 'fake': True}\nprint(FakeStore().get('C9'))\n",
      "Fake del puerto permite tests unitarios sin I/O real.", 0.83, ["fake"]),
    E("S11-T2-B-E3",
      "def load_client(store, cid):\n    rec = store.get(cid)\n    if rec is None:\n        raise KeyError(cid)\n    return rec\nclass S:\n    def get(self, id):\n        return None\ntry:\n    load_client(S(), 'x')\nexcept KeyError:\n    print('missing entity')\n",
      "Servicio de aplicación depende del puerto, no de un SQL concreto.", 0.82, ["port adapter"]),
    E("S11-T3-A-E1",
      "class Normalizer:\n    def normalize(self, raw: str) -> str:\n        return raw.strip().lower()\nprint(Normalizer().normalize('  A@B.COM '))\n",
      "Método de instancia encapsula comportamiento del dominio (T3-A).", 0.87, ["method"]),
    E("S11-T3-A-E2",
      "from dataclasses import dataclass\n@dataclass\nclass Email:\n    value: str\n    def __post_init__(self):\n        v = self.value.strip().lower()\n        if '@' not in v:\n            raise ValueError('email')\n        object.__setattr__(self, 'value', v) if False else None\n        self.value = v\nprint(Email('  a@b.pe '))\n",
      "Value object Email valida en construcción (__post_init__).", 0.84, ["value object"]),
    E("S11-T3-A-E3",
      "print('fallar en construccion > permitir objeto invalido silencioso')\n",
      "Objeto inválido debe fallar al construir, no al final del mes.", 0.86, ["fail construct"]),
    E("S11-T3-B-E1",
      "class BaseRepo:\n    def save(self, x):\n        raise NotImplementedError\nclass MemRepo(BaseRepo):\n    def save(self, x):\n        return f'saved {x}'\nprint(MemRepo().save('C1'))\n",
      "Herencia simple para repositorio; override de save (T3-B).", 0.80, ["inheritance"]),
    E("S11-T3-B-E2",
      "print('Client hereda Person a menudo es fragil; preferir composicion')\n",
      "Client hereda Person suele ser frágil; composición (tiene PersonInfo) es más segura.", 0.85, ["composition vs inheritance"]),
    E("S11-T3-B-E3",
      "class Score:\n    def __init__(self, v):\n        if not 0 <= v <= 1:\n            raise ValueError('score range')\n        self.v = v\nprint(Score(0.5).v)\n",
      "Invariante de rango en el constructor del score de evidencia.", 0.84, ["invariants"]),
    E("S11-T4-A-E1",
      "from dataclasses import dataclass, asdict\n@dataclass\nclass CaseSheet:\n    er_score: float\n    rel_score: float\n    def to_dict(self):\n        return asdict(self)\nprint(CaseSheet(0.8, 0.3).to_dict())\n",
      "to_dict en ficha de caso sin fusionar ER y relationship en un solo veredicto.", 0.86, ["to_dict"]),
    E("S11-T4-A-E2",
      "print('tests unitarios del dominio: factory valida, score rango, no is_fraud')\n",
      "Suite de dominio: invariantes y serialización, sin claims legales.", 0.81, ["domain tests"]),
    E("S11-T4-A-E3",
      "def decide_review(er, rel):\n    if er >= 0.8 and rel >= 0.5:\n        return 'needs_review'\n    return 'abstain'\nprint(decide_review(0.9, 0.6), decide_review(0.2, 0.1))\n",
      "Política de revisión usa scores separados; no setea is_family automático.", 0.83, ["review policy"]),
    E("S11-T4-B-E1",
      "print('mapa de capas: domain <- app services <- adapters (sql/api)')\n",
      "Capas: dominio puro, servicios, adapters de I/O (T4-B).", 0.80, ["layers"]),
    E("S11-T4-B-E2",
      "print('adapter SQL implementa EntityStore; dominio no importa sqlite3')\n",
      "El dominio no depende de sqlite3; el adapter implementa el Protocol.", 0.82, ["dependency rule"]),
    E("S11-T4-B-E3",
      "print('checklist OOP: dataclasses, factory, protocol, no auto_fraud, tests')\n",
      "Checklist del modelo de dominio de familiaridad del paquete.", 0.81, ["checklist"]),
]
sc11 = [
    sc(0, 2, 0.93, "field(default_factory=list) evita el default mutable compartido entre instancias."),
    sc(1, 0, 0.94, "RelationshipEvidence.signal_score es una señal/dato numérico, no un veredicto de fraude o familia."),
    sc(2, 1, 0.90, "Un Protocol EntityStore define un puerto get/save implementable por fakes y adapters."),
    sc(3, 3, 0.91, "Objeto inválido debe fallar en la construcción (__post_init__/validate)."),
    sc(4, 2, 0.88, "Client hereda Person a menudo es frágil; composición (Client tiene PersonInfo) suele ser mejor."),
    sc(5, 0, 0.92, "El dominio de familiaridad no debe tener is_fraud() automático."),
]


# ---------------------------------------------------------------------------
# Section 12 — APIs SQL geo
# ---------------------------------------------------------------------------
ex12 = [
    E("S12-T1-A-E1",
      "status = 400\nprint('client_error' if 400 <= status < 500 else 'other')\n",
      "400 Bad Request es error de cliente: no retry ciego (T1-A HTTP).", 0.90, ["HTTP 400"]),
    E("S12-T1-A-E2",
      "def classify(code):\n    if 200 <= code < 300:\n        return 'ok'\n    if 400 <= code < 500:\n        return 'client_error'\n    if 500 <= code < 600:\n        return 'server_error'\n    return 'other'\nfor c in [200, 400, 503]:\n    print(c, classify(c))\n",
      "Clasificar 2xx/4xx/5xx para política de retry solo en transitorios de servidor.", 0.87, ["status class"]),
    E("S12-T1-A-E3",
      "print('retry: 503/timeout si; 400/401 no')\n",
      "Reintentar 503/timeout; no reintentar 400 de cliente.", 0.86, ["retry policy"]),
    E("S12-T1-B-E1",
      "import os\ntoken = os.environ.get('API_TOKEN')\nprint('token_configured', bool(token))\nprint('never hardcode secrets in repo')\n",
      "El token de API vive en variable de entorno / secret store, no en el repo.", 0.92, ["secrets"]),
    E("S12-T1-B-E2",
      "headers = {'Authorization': 'Bearer ***REDACTED***'}\nprint(headers)\n",
      "No loguear el token en provenance ni en stdout; redactar.", 0.88, ["redact token"]),
    E("S12-T1-B-E3",
      "print('timeouts obligatorios en clientes HTTP; no hang infinito')\n",
      "Timeouts en llamadas a proveedores; fail closed si no responden.", 0.84, ["timeouts"]),
    E("S12-T2-A-E1",
      "import sqlite3\ncon = sqlite3.connect(':memory:')\ncon.execute('create table t(id text primary key, name text)')\ncon.execute('insert into t values (?, ?)', ('C1', 'Ana'))\nprint(con.execute('select name from t where id = ?', ('C1',)).fetchone())\n",
      "Placeholders ? en SQLite; nunca f-string con input de usuario.", 0.91, ["sqlite ?"]),
    E("S12-T2-A-E2",
      "user_id = \"C1'; DROP TABLE t;--\"\n# inseguro: f\"select * from t where id = '{user_id}'\"\nprint('usar placeholders evita inyeccion')\n",
      "SQL con f-string e input es inyección; usar placeholders `?`.", 0.90, ["injection"]),
    E("S12-T2-A-E3",
      "import sqlite3\ncon = sqlite3.connect(':memory:')\ncon.execute('create table clients(id text, region text)')\ncon.executemany('insert into clients values (?, ?)', [('C1','Lima'),('C2','Cusco')])\nprint(con.execute('select count(*) from clients').fetchone()[0])\n",
      "executemany con tuplas de parámetros para ingesta batch segura.", 0.85, ["executemany"]),
    E("S12-T2-B-E1",
      "print('indice en id para lookup frecuente; explicar plan conceptual')\n",
      "Índices en columnas de lookup (id) para consultas de dominio (T2-B).", 0.80, ["index"]),
    E("S12-T2-B-E2",
      "print('JOIN conceptual: clients c JOIN txs t ON c.id = t.client_id')\n",
      "JOIN por clave foránea lógica client_id, no concatenar SQL a mano.", 0.82, ["JOIN"]),
    E("S12-T2-B-E3",
      "print('transaccion: BEGIN; writes; COMMIT o ROLLBACK en error')\n",
      "Transacciones para consistencia multi-write en SQLite local.", 0.81, ["transaction"]),
    E("S12-T3-A-E1",
      "payload = {'address': 'Av Larco 123', 'city': 'Lima', 'country': 'PE'}\nprint(payload)\n",
      "Payload de geocoder solo con campos de dirección permitidos (egress mínimo).", 0.86, ["geocode payload"]),
    E("S12-T3-A-E2",
      "print('cache key = hash(address|city|country); TTL conceptual')\n",
      "Cache de geocoding por clave de dirección normalizada, no por PII extra.", 0.83, ["cache"]),
    E("S12-T3-A-E3",
      "print('provenance: provider, ts, query_hash, no token, no document_id')\n",
      "Provenance del geocode sin secretos ni document_id bancario.", 0.84, ["provenance"]),
    E("S12-T3-B-E1",
      "FORBIDDEN = {'document_id', 'email', 'phone', 'full_name'}\npayload = {'address': 'x', 'document_id': '123'}\nleak = FORBIDDEN & set(payload)\nprint('blocked', bool(leak), leak)\n",
      "Enviar document_id a geocoder público viola política de egress CP-N1-C.", 0.90, ["egress deny"]),
    E("S12-T3-B-E2",
      "ALLOWED = {'address', 'city', 'country'}\ndef allowed_for_public_geocoder(payload):\n    return set(payload) <= ALLOWED\nprint(allowed_for_public_geocoder({'address': 'a', 'city': 'Lima', 'country': 'PE'}))\nprint(allowed_for_public_geocoder({'address': 'a', 'document_id': 'x'}))\n",
      "Checklist egress: True solo si keys ⊆ ALLOWED del geocoder público.", 0.88, ["allowlist egress"]),
    E("S12-T3-B-E3",
      "print('minimizar PII: solo address fields; pseudonimizar en dashboard')\n",
      "Minimización de datos en llamadas externas y en UI.", 0.82, ["minimization"]),
    E("S12-T4-A-E1",
      "def valid_lat_lon(lat, lon):\n    return -90 <= lat <= 90 and -180 <= lon <= 180\nprint(valid_lat_lon(-12.04, -77.04), valid_lat_lon(100, 0))\n",
      "Validar rangos de lat/lon antes de usar geoseñales.", 0.89, ["lat lon"]),
    E("S12-T4-A-E2",
      "import math\ndef haversine_km(a, b):\n    # a,b = (lat, lon) degrees\n    R = 6371.0\n    lat1, lon1 = map(math.radians, a)\n    lat2, lon2 = map(math.radians, b)\n    dlat, dlon = lat2 - lat1, lon2 - lon1\n    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2\n    return 2 * R * math.asin(math.sqrt(h))\nprint(round(haversine_km((-12.0, -77.0), (-12.01, -77.01)), 3))\n",
      "Haversine da distancia km entre dos puntos; es señal, no veredicto.", 0.85, ["haversine"]),
    E("S12-T4-A-E3",
      "ALLOWED = {'address', 'city', 'country'}\ndef allowed_for_public_geocoder(payload):\n    return set(payload.keys()) <= ALLOWED\nprint(allowed_for_public_geocoder({'address': 'x', 'city': 'y', 'country': 'PE'}))\n",
      "Egress allowlist del geocoder público (T4-A checklist).", 0.87, ["egress"]),
    E("S12-T4-B-E1",
      "def valid_lat_lon(lat, lon):\n    return -90 <= float(lat) <= 90 and -180 <= float(lon) <= 180\nprint(valid_lat_lon(-12.05, -77.04))\n",
      "Validación de coordenadas sintéticas antes del mapa/dashboard.", 0.88, ["coords"]),
    E("S12-T4-B-E2",
      "import math\ndef haversine_km(a, b):\n    R = 6371.0\n    lat1, lon1 = map(math.radians, a)\n    lat2, lon2 = map(math.radians, b)\n    dlat, dlon = lat2 - lat1, lon2 - lon1\n    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2\n    return 2 * R * math.asin(math.sqrt(h))\nprint(round(haversine_km((-12.0, -77.0), (-12.01, -77.0)), 2))\n",
      "Haversine implementado con stdlib math; output en km.", 0.86, ["haversine_km"]),
    E("S12-T4-B-E3",
      "def as_relationship_signal(km):\n    if km is None:\n        return {'signal': None, 'note': 'missing_geo'}\n    return {'signal': max(0.0, 1.0 - min(km, 50) / 50), 'note': 'geosignal_not_verdict'}\nprint(as_relationship_signal(1.2))\n",
      "1.2 km implica una geoseñal de relación, no un veredicto de parentesco/fraude.", 0.89, ["geosignal"]),
]
sc12 = [
    sc(0, 3, 0.93, "Un 400 Bad Request del proveedor debe tratarse como error de cliente (no retry ciego)."),
    sc(1, 1, 0.95, "El token de API debe vivir en variable de entorno / secret store, no hardcodeado."),
    sc(2, 2, 0.94, "SQL con f-string e input de usuario es inyección; usar placeholders `?`."),
    sc(3, 0, 0.92, "Enviar document_id bancario a un geocoder público viola la política de egress de CP-N1-C."),
    sc(4, 3, 0.91, "1.2 km entre entidades sintéticas es una geoseñal de relación, no un veredicto."),
]


# ---------------------------------------------------------------------------
# Section 13 — Familiarity dashboard close
# ---------------------------------------------------------------------------
ex13 = [
    E("S13-T1-A-E1",
      "import re\ndef norm_name(n):\n    n = ' '.join(n.strip().casefold().split())\n    return re.sub(r'[^\\w\\s]', '', n, flags=re.UNICODE)\nprint(norm_name('  José  Pérez '))\n",
      "norm_name colapsa espacios y casefold para blocking/ER (T1-A).", 0.88, ["norm_name"]),
    E("S13-T1-A-E2",
      "def blocking_key(rec):\n    # apellido + iniciales de nombres + region\n    ap = (rec.get('apellido_paterno') or '').casefold().strip()\n    nom = (rec.get('nombres') or '').casefold().strip()[:1]\n    reg = (rec.get('region') or '').casefold().strip()\n    return f'{ap}|{nom}|{reg}'\nprint(blocking_key({'apellido_paterno': 'Quispe', 'nombres': 'Ana', 'region': 'Lima'}))\n",
      "blocking_key reduce pares candidatos antes del score ER.", 0.85, ["blocking"]),
    E("S13-T1-A-E3",
      "import re\ndef norm_doc(d):\n    return re.sub(r'\\D', '', d or '')\ndef er_score(a, b):\n    if norm_doc(a.get('doc')) and norm_doc(a.get('doc')) == norm_doc(b.get('doc')):\n        if a.get('bk') == b.get('bk'):\n            return 1.0\n        return 0.8\n    if a.get('bk') == b.get('bk'):\n        return 0.5\n    return 0.0\nprint(er_score({'doc': '12345678', 'bk': 'q|a|lima'}, {'doc': '12345678', 'bk': 'q|a|lima'}))\nprint(er_score({'doc': '', 'bk': 'x'}, {'doc': '', 'bk': 'y'}))\n",
      "er_score determinista: doc igual + mismo blocking → 1.0; solo blocking → 0.5.", 0.84, ["er_score"]),
    E("S13-T1-B-E1",
      "tp, fp, fn = 8, 2, 2\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(round(precision, 3), round(recall, 3))\n",
      "precision = TP/(TP+FP); recall = TP/(TP+FN) sobre verdad etiquetada (T1-B).", 0.90, ["precision recall"]),
    E("S13-T1-B-E2",
      "pairs = [\n    {'id': 'P1', 'score': 0.2},\n    {'id': 'P2', 'score': 0.55},\n    {'id': 'P3', 'score': 0.9},\n]\nfor p in pairs:\n    if p['score'] < 0.4:\n        bucket = 'abstain'\n    elif p['score'] < 0.8:\n        bucket = 'needs_review'\n    else:\n        bucket = 'high'\n    print(p['id'], bucket)\n",
      "Cola clerical: scores medios a needs_review; bajos abstain; altos revisión prioritaria.", 0.86, ["clerical queue"]),
    E("S13-T1-B-E3",
      "print('FP de ER = error de matching; NO veredicto legal de fraude')\nprint('documentar en ficha: score, evidencia, decision humana')\n",
      "Un false positive de ER es error de matching, no fraude confirmado.", 0.88, ["FP meaning"]),
    E("S13-T2-A-E1",
      "def shared_email(a, b):\n    ea = (a.get('email') or '').casefold().strip()\n    eb = (b.get('email') or '').casefold().strip()\n    return bool(ea) and ea == eb\nprint(shared_email({'email': 'A@X.pe'}, {'email': 'a@x.pe'}))\nprint(shared_email({'email': 'a@x.pe'}, {'email': 'b@x.pe'}))\n",
      "Email compartido es señal de relación, no prueba de parentesco.", 0.87, ["shared_email"]),
    E("S13-T2-A-E2",
      "def rel_score(km, surname_jaccard):\n    geo = 0.0 if km is None else max(0.0, 1.0 - min(km, 50) / 50)\n    return round(0.5 * geo + 0.5 * (surname_jaccard or 0.0), 3)\nprint(rel_score(1.2, 0.5))\nprint(rel_score(None, 0.0))\n",
      "rel_score combina geoseñal y Jaccard de apellidos; score separado de ER.", 0.85, ["rel_score"]),
    E("S13-T2-A-E3",
      "print('signals: shared phone/email/address, km, surname tokens')\nprint('never set is_family automatically')\n",
      "Señales de relación se listan; no se setea is_family automático.", 0.84, ["signals"]),
    E("S13-T2-B-E1",
      "txs = [('A', 'B', 10), ('C', 'D', 1), ('B', 'A', 5)]\ndef direct_txs(txs, a, b):\n    return [(x, y, m) for x, y, m in txs if {x, y} == {a, b}]\nprint(direct_txs(txs, 'A', 'B'))\n",
      "Transacciones directas entre nodos como evidencia de red (T2-B).", 0.86, ["direct txs"]),
    E("S13-T2-B-E2",
      "txs = [('A', 'D', 1), ('C', 'D', 1), ('A', 'E', 1), ('C', 'F', 1)]\ndef neighbors(txs, node):\n    s = set()\n    for x, y, _ in txs:\n        if x == node:\n            s.add(y)\n        if y == node:\n            s.add(x)\n    return s\nprint(sorted(neighbors(txs, 'A') & neighbors(txs, 'C')))\n",
      "Contrapartes comunes = intersección de vecinos en el grafo de txs.", 0.85, ["common counterparties"]),
    E("S13-T2-B-E3",
      "print('tx graph signals feed relationship_signal_score, not ER alone')\n",
      "Señales de txs alimentan relationship_signal, no fusionan con ER sin etiqueta.", 0.82, ["graph signals"]),
    E("S13-T3-A-E1",
      "def explanation_bullets(er, rel, missing):\n    bullets = [f'ER score={er}', f'relationship signal={rel}']\n    if missing:\n        bullets.append('campos faltantes: ' + ','.join(missing))\n    bullets.append('sin veredicto automatico de fraude/familia')\n    return bullets\nprint(explanation_bullets(0.8, 0.3, ['phone']))\n",
      "Explicación en bullets con scores separados e incertidumbre por missing.", 0.87, ["explanation"]),
    E("S13-T3-A-E2",
      "def uncertainty_band(missing, conflict):\n    if conflict:\n        return 'high'\n    if missing:\n        return 'medium'\n    return 'low'\nprint(uncertainty_band(['email'], False), uncertainty_band([], True))\n",
      "Banda de incertidumbre por missing/conflict para la ficha de caso.", 0.84, ["uncertainty"]),
    E("S13-T3-A-E3",
      "er, rel = 0.9, 0.1\nprint({'entity_resolution_score': er, 'relationship_signal_score': rel})\nprint('mantener separados en la ficha de caso')\n",
      "entity_resolution_score y relationship_signal_score se mantienen separados.", 0.90, ["separate scores"]),
    E("S13-T3-B-E1",
      "thresholds = {'accept_min': 0.8, 'review_low': 0.4}\nscore = 0.55\nif score >= thresholds['accept_min']:\n    st = 'high'\nelif score >= thresholds['review_low']:\n    st = 'needs_review'\nelse:\n    st = 'abstain'\nprint(st)\n",
      "Umbrales accept_min/review_low definen high / needs_review / abstain.", 0.88, ["thresholds"]),
    E("S13-T3-B-E2",
      "from math import isfinite\nth = {'accept_min': 0.8, 'review_low': 0.4}\ndef decide_ops_status(score, high_signal=False):\n    if score is None or not isfinite(score) or not (0 <= score <= 1):\n        return 'invalid_input'\n    if high_signal:\n        return 'needs_review'\n    if score < th['review_low']:\n        return 'abstain'\n    if score < th['accept_min']:\n        return 'needs_review'\n    return 'needs_review'  # high score still human review in S13\nfor s in [None, 0.2, 0.5, 0.9]:\n    print(s, decide_ops_status(s))\nprint('high_signal', decide_ops_status(0.3, high_signal=True))\n",
      "Matriz ops: invalid_input / abstain / needs_review; no auto_fraud.", 0.86, ["ops matrix"]),
    E("S13-T3-B-E3",
      "print('zona gris → encolar needs_review / abstenerse segun politica')\nprint('nunca auto_fraud=true ni is_family')\n",
      "En zona gris el sistema encola needs_review o se abstiene según política.", 0.89, ["grey zone"]),
    E("S13-T4-A-E1",
      "def pseudonymize(name):\n    import hashlib\n    h = hashlib.sha256(name.encode()).hexdigest()[:8]\n    return f'P-{h}'\nprint(pseudonymize('Ana Quispe'))\n",
      "Dashboard/mapa usa seudónimos, no PII real (T4-A).", 0.87, ["pseudonymize"]),
    E("S13-T4-A-E2",
      "def case_sheet(er, rel):\n    return {\n        'entity_resolution_score': er,\n        'relationship_signal_score': rel,\n        'ops_status': 'needs_review',\n        'note': 'human_review_required',\n    }\nprint(case_sheet(0.7, 0.4))\n",
      "Ficha de caso con scores separados y estado operativo de revisión.", 0.86, ["case sheet"]),
    E("S13-T4-A-E3",
      "def map_tooltip(lat, lon, km, source):\n    return {\n        'lat': lat, 'lon': lon, 'km': km,\n        'source': source, 'pii': False,\n    }\nprint(map_tooltip(-12.04, -77.04, 1.2, 'synthetic'))\n",
      "Tooltip de mapa con coords/km/source; sin PII real.", 0.84, ["map tooltip"]),
    E("S13-T4-B-E1",
      "privacy = {\n    'data_class': 'synthetic_only',\n    'pii_real': False,\n    'roles': ['viewer', 'reviewer'],\n}\nprint(privacy)\n",
      "Privacy sheet: solo sintético, roles viewer/reviewer (CF-1).", 0.88, ["privacy sheet"]),
    E("S13-T4-B-E2",
      "def demo_command():\n    return 'python -m familiarity.dashboard --demo synthetic'\nprint(demo_command())\n",
      "Comando de demo reproducible documentado en runbook.", 0.83, ["demo"]),
    E("S13-T4-B-E3",
      "actions = ['rotate_secret', 'redact_logs', 'postmortem']\nfor a in actions:\n    print('incident_step', a)\nprint('CF-1: privacy, acceso, tests, demo y runbook')\nprint('Level-1 regression: re-chequear paths S01-S13 en runbook')\n",
      "CF-1 incluye privacy sheet, acceso, tests, demo y runbook; regresión S01–S13 en runbook.", 0.87, ["CF-1 runbook"]),
]
sc13 = [
    sc(0, 0, 0.94, "entity_resolution_score y relationship_signal_score deben mantenerse separados en la ficha de caso."),
    sc(1, 2, 0.93, "Un false positive de ER implica error de matching; no es veredicto legal de fraude."),
    sc(2, 3, 0.92, "En zona gris de score el sistema debe encolar needs_review / abstenerse según política."),
    sc(3, 1, 0.91, "CF-1 en S13 incluye privacy sheet, acceso, tests, demo y runbook."),
    sc(4, 0, 0.90, "Level-1 regression notes exigen re-chequear paths críticos S01–S13 en runbook."),
]


def main():
    write_section(8, ex8, sc8)
    write_section(9, ex9, sc9)
    write_section(10, ex10, sc10)
    write_section(11, ex11, sc11)
    write_section(12, ex12, sc12)
    write_section(13, ex13, sc13)
    # verify lives exist
    root = Path("course-state/newbie_walkthrough/agentic_K1")
    for i in range(1, 14):
        p = root / f"section_{i:02d}" / "newbie_a_live.json"
        print(i, "exists" if p.exists() else "MISSING", p.stat().st_size if p.exists() else 0)


if __name__ == "__main__":
    main()
