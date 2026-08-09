
# ========== S09 ==========

def s09_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 0, "raise NewError(...) from e encadena la causa en __cause__."),
            sc(1, 2, "Delimiter vacio en config es fail-fast del job, no cuarentena de una fila."),
            sc(2, 3, "stdout = datos; diagnostico a stderr."),
            sc(3, 1, "mask_email seguro: a***@ejemplo.pe estilo enmascarado."),
            sc(4, 0, "TimeoutError puede reintentarse; ValueError de datos no."),
            sc(5, 2, "Minimal repro: entrada mas pequena que reproduce el bug."),
        ]
    return [
        sc(0, 0, "Encadenamiento de excepciones del paquete S09."),
        sc(1, 2, "Errores de config -> abortar job."),
        sc(2, 3, "Separacion stdout/stderr en CLI."),
        sc(3, 1, "Enmascarar PII en logs."),
        sc(4, 0, "Retry solo en fallos transitorios de red."),
        sc(5, 2, "Repro minimo para debugging."),
    ]

def s09_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S09-T1-A-E1', 'fallos = [\n    ("archivo ausente", "FileNotFoundError"),\n    ("tipo malo", "TypeError"),\n    ("valor malo", "ValueError"),\n    ("clave dict", "KeyError"),\n    ("timeout red", "TimeoutError"),\n]\nfor f, t in fallos:\n    print(f"{f} -> {t}")\n', 'mapea 5 fallos a tipos de excepcion.' if A else 'catalogo de errores S09.', ['exceptions']))
    out.append(ex('S09-T1-A-E2', 'try:\n    int("x")\nexcept ValueError as e:\n    print(type(e).__name__, e)\n', 'captura ValueError.' if A else 'mensaje de conversion.', ['except']))
    out.append(ex('S09-T1-A-E3', 'class IntakeError(Exception):\n    pass\ntry:\n    raise IntakeError("campo edad")\nexcept IntakeError as e:\n    print(e)\n', 'excepcion de dominio propia.' if A else 'mensaje con campo.', ['custom']))
    out.append(ex('S09-T1-B-E1', 'try:\n    raise ValueError("raw")\nexcept ValueError as e:\n    raise RuntimeError("wrap") from e\n', 'raise from encadena causa.' if A else 'demo __cause__.', ['raise from']))
    out.append(ex('S09-T1-B-E2', 'def load_config(delim):\n    if delim is None or delim == "":\n        raise ValueError("delimiter vacio: fail-fast")\n    return delim\ntry:\n    load_config("")\nexcept ValueError as e:\n    print(e)\n', 'config invalida fail-fast.' if A else 'no cuarentenar fila.', ['fail-fast']))
    out.append(ex('S09-T1-B-E3', 'def parse_or_quarantine(row):\n    try:\n        return "ok", int(row)\n    except ValueError:\n        return "quarantine", row\nprint(parse_or_quarantine("10"), parse_or_quarantine("x"))\n', 'error de fila -> quarantine; no abortar job.' if A else 'vs fail-fast de config.', ['quarantine']))
    out.append(ex('S09-T2-A-E1', 'import sys\nprint("dato", file=sys.stdout)\nprint("diag", file=sys.stderr)\n', 'datos stdout; diag stderr.' if A else 'CLI limpia.', ['streams']))
    out.append(ex('S09-T2-A-E2', 'import logging\nlogging.basicConfig(level=logging.INFO)\nlog = logging.getLogger("intake")\nlog.info("filas=%s", 3)\nprint(\'{"n":3}\')\n', 'log a logger; JSON a stdout.' if A else 'no mezclar.', ['logging']))
    out.append(ex('S09-T2-A-E3', 'def cli_emit(payload, log_msg):\n    import sys\n    print(log_msg, file=sys.stderr)\n    print(payload)\ncli_emit(\'{"ok":true}\', "done")\n', 'helper emit separado.' if A else 'contrato CLI.', ['cli']))
    out.append(ex('S09-T2-B-E1', 'def mask_email(e):\n    if "@" not in e:\n        return "***"\n    local, domain = e.split("@", 1)\n    return (local[:1] + "***@" + domain) if local else "***@" + domain\nprint(mask_email("ana@ejemplo.pe"))\n', 'a***@ejemplo.pe style.' if A else 'mask seguro.', ['mask']))
    out.append(ex('S09-T2-B-E2', 'def mask_phone(p):\n    digits = "".join(c for c in p if c.isdigit())\n    if len(digits) < 4:\n        return "***"\n    return "*" * (len(digits) - 4) + digits[-4:]\nprint(mask_phone("999000111"))\n', 'enmascara dejando ultimos 4.' if A else 'logs sin PII completa.', ['mask']))
    out.append(ex('S09-T2-B-E3', 'def safe_log_record(rec):\n    out = dict(rec)\n    if "email" in out:\n        e = out["email"]\n        out["email"] = e[0] + "***@" + e.split("@")[-1] if e and "@" in e else "***"\n    return out\nprint(safe_log_record({"id": "C1", "email": "ana@ejemplo.pe"}))\n', 'record logeable sin email claro.' if A else 'redaccion.', ['redact']))
    out.append(ex('S09-T3-A-E1', 'def fetch(retry=0):\n    if retry < 2:\n        raise TimeoutError("temp")\n    return "ok"\nattempt = 0\nwhile True:\n    try:\n        print(fetch(attempt))\n        break\n    except TimeoutError:\n        attempt += 1\n        if attempt > 3:\n            raise\n', 'retry TimeoutError con tope.' if A else 'no retry ValueError.', ['retry']))
    out.append(ex('S09-T3-A-E2', 'def classify_error(e):\n    if isinstance(e, TimeoutError):\n        return "retryable"\n    if isinstance(e, ValueError):\n        return "data"\n    return "other"\nprint(classify_error(TimeoutError()), classify_error(ValueError("x")))\n', 'clasifica retryable vs data.' if A else 'politica de reintento.', ['classify']))
    out.append(ex('S09-T3-A-E3', 'import time\ndef backoff(i):\n    return min(2 ** i, 8)\nprint([backoff(i) for i in range(4)])\n', 'backoff exponencial acotado.' if A else '1,2,4,8.', ['backoff']))
    out.append(ex('S09-T3-B-E1', 'def minimal_repro(rows):\n    for r in rows:\n        try:\n            int(r)\n        except ValueError:\n            return r\n    return None\nprint(minimal_repro(["1", "2", "x", "4"]))\n', 'repro minimo: primera fila que falla.' if A else 'no todo el CSV.', ['repro']))
    out.append(ex('S09-T3-B-E2', 'def assert_repro(fn, sample):\n    try:\n        fn(sample)\n        return "no_fail"\n    except Exception as e:\n        return type(e).__name__\nprint(assert_repro(lambda s: int(s), "x"))\n', 'verifica que el repro falla como se espera.' if A else 'nombre de excepcion.', ['repro']))
    out.append(ex('S09-T3-B-E3', 'bug_note = {\n    "input": "edad=\'abc\'",\n    "expected": "ValueError capturado a errors",\n    "not": "CSV completo de produccion",\n}\nprint(bug_note)\n', 'documenta minimal repro.' if A else 'sin datos de prod.', ['docs']))
    out.append(ex('S09-T4-A-E1', 'import traceback\ntry:\n    1/0\nexcept ZeroDivisionError:\n    print("caught")\n    # traceback.print_exc()  # a stderr en debug\n', 'captura y opcional traceback.' if A else 'no silenciar sin log.', ['traceback']))
    out.append(ex('S09-T4-A-E2', 'def handle(e):\n    return {"error_type": type(e).__name__, "msg": str(e)}\nprint(handle(ValueError("edad")))\n', 'estructura de error para API/log.' if A else 'type + msg.', ['error dict']))
    out.append(ex('S09-T4-A-E3', 'errors = []\nfor raw in ["10", "x"]:\n    try:\n        errors.append(("ok", int(raw)))\n    except ValueError as e:\n        errors.append(("err", str(e)))\nprint(errors)\n', 'acumula errores por fila.' if A else 'batch resilient.', ['batch']))
    out.append(ex('S09-T4-B-E1', 'def job(config):\n    if not config.get("delimiter"):\n        raise SystemExit(2)\n    return 0\nprint(job({"delimiter": ","}))\n', 'exit 2 estilo uso/config.' if A else 'fail-fast config.', ['exit codes']))
    out.append(ex('S09-T4-B-E2', 'STEPS = ["validate_config", "read", "parse", "write", "reconcile"]\nprint(STEPS)\n', 'pipeline steps nombrados.' if A else 'runbook debug.', ['steps']))
    out.append(ex('S09-T4-B-E3', 'runbook = {\n    "on_TimeoutError": "retry with backoff",\n    "on_ValueError": "quarantine row",\n    "on_config_error": "fail-fast",\n}\nprint(runbook)\n', 'matriz de respuesta a fallos.' if A else 'operacion segura.', ['runbook']))
    return out
