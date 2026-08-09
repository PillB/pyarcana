
# ========== S05 ==========

def s05_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 0, "Sin return explicito la llamada devuelve None."),
            sc(1, 2, "Default mutable [] se comparte entre llamadas: peligroso."),
            sc(2, 3, "Pura: mismo input -> mismo output sin efectos colaterales."),
            sc(3, 1, "LEGB = Local, Enclosing, Global, Builtin."),
            sc(4, 0, "Idempotencia: f(f(x)) == f(x) en el dominio."),
        ]
    return [
        sc(0, 0, "Teoria de funciones: return implicito None."),
        sc(1, 2, "S05 defaults mutables compartidos."),
        sc(2, 3, "Definicion de pureza del paquete."),
        sc(3, 1, "Orden de resolucion de nombres LEGB."),
        sc(4, 0, "Normalizador idempotente f(f(x))=f(x)."),
    ]

def s05_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S05-T1-A-E1', 'def doble(n):\n    return n * 2\nprint(doble(21))\n', 'doble retorna n*2; print 42.' if A else 'funcion minima con return.', ['def']))
    out.append(ex('S05-T1-A-E2', 'def saludo(nombre, prefijo="Hola"):\n    return f"{prefijo}, {nombre}"\nprint(saludo("Ana"))\nprint(saludo("Ana", prefijo="Buenas"))\n', 'default prefijo + override.' if A else 'kwargs opcionales.', ['defaults']))
    out.append(ex('S05-T1-A-E3', 'def area_rect(base, altura):\n    """Retorna base*altura; no imprime."""\n    return base * altura\nprint(area_rect(3, 4))\nassert area_rect(3, 4) == 12\n', 'contrato return sin print interno.' if A else 'docstring + assert.', ['contract']))
    out.append(ex('S05-T1-B-E1', 'def f(xs=None):\n    if xs is None:\n        xs = []\n    xs.append(1)\n    return xs\nprint(f())\nprint(f())\n', 'None sentinel evita default mutable compartido.' if A else 'patron seguro de lista default.', ['mutable default']))
    out.append(ex('S05-T1-B-E2', 'def normalize_name(s: str) -> str:\n    return " ".join(s.strip().split())\nprint(normalize_name("  Ana   Quispe "))\nprint(normalize_name(normalize_name("  Ana   Quispe ")))\n', 'idempotente strip/join espacios.' if A else 'f(f(x))==f(x).', ['idempotent']))
    out.append(ex('S05-T1-B-E3', 'def parse_edad(txt: str):\n    try:\n        return int(txt.strip())\n    except ValueError as e:\n        raise ValueError(f"edad invalida: {txt!r}") from e\nprint(parse_edad(" 19 "))\ntry:\n    parse_edad("x")\nexcept ValueError as e:\n    print(type(e).__name__, e)\n', 'ValueError con mensaje de campo.' if A else 'raise from opcional pedagogico.', ['errors']))
    out.append(ex('S05-T2-A-E1', 'def add(a, b):\n    return a + b\nprint(add(2, 3))\n', 'firma posicional simple.' if A else 'return suma.', ['params']))
    out.append(ex('S05-T2-A-E2', 'def report(*, title, n_rows):\n    return f"{title}: {n_rows} filas"\nprint(report(title="intake", n_rows=3))\n', 'keyword-only con *.' if A else 'fuerza claridad en call site.', ['kwonly']))
    out.append(ex('S05-T2-A-E3', 'def clamp(x, lo=0, hi=100):\n    if x < lo:\n        return lo\n    if x > hi:\n        return hi\n    return x\nprint(clamp(-5), clamp(50), clamp(200))\n', 'defaults lo/hi; clamp rango.' if A else '0 50 100.', ['clamp']))
    out.append(ex('S05-T2-B-E1', 'def summarize(nums):\n    return {"n": len(nums), "total": sum(nums)}\nprint(summarize([1, 2, 3]))\n', 'dict de resumen puro.' if A else 'sin mutar entrada.', ['pure']))
    out.append(ex('S05-T2-B-E2', 'def apply_all(fn, values):\n    return [fn(v) for v in values]\nprint(apply_all(lambda x: x * 2, [1, 2, 3]))\n', 'higher-order map simple.' if A else 'fn aplicada a cada valor.', ['hof']))
    out.append(ex('S05-T2-B-E3', 'def pipeline(x, steps):\n    for step in steps:\n        x = step(x)\n    return x\nprint(pipeline("  Ana  ", [str.strip, str.upper]))\n', 'pipeline de funciones puras.' if A else 'strip luego upper.', ['pipeline']))
    out.append(ex('S05-T3-A-E1', 'def outer(msg):\n    def inner():\n        return msg\n    return inner\nprint(outer("hola")())\n', 'closure lee enclosing msg.' if A else 'LEGB enclosing.', ['closure']))
    out.append(ex('S05-T3-A-E2', 'x = 10\ndef show():\n    x = 5  # local\n    return x\nprint(show(), x)\n', 'local no pisa global sin global.' if A else '5 y 10.', ['scope']))
    out.append(ex('S05-T3-A-E3', 'def make_counter():\n    n = 0\n    def inc():\n        nonlocal n\n        n += 1\n        return n\n    return inc\nc = make_counter()\nprint(c(), c(), c())\n', 'nonlocal para contador.' if A else '1 2 3.', ['nonlocal']))
    out.append(ex('S05-T3-B-E1', 'def safe_div(a, b):\n    if b == 0:\n        return None\n    return a / b\nprint(safe_div(10, 2), safe_div(1, 0))\n', 'guard de division por cero.' if A else 'None en error de dominio.', ['guard']))
    out.append(ex('S05-T3-B-E2', 'def validate_score(s):\n    if not isinstance(s, (int, float)):\n        return {"ok": False, "error": "type"}\n    if not 0 <= s <= 100:\n        return {"ok": False, "error": "range"}\n    return {"ok": True, "value": s}\nprint(validate_score(80), validate_score(-1), validate_score("x"))\n', 'contrato resultado dict.' if A else 'tipo y rango.', ['validate']))
    out.append(ex('S05-T3-B-E3', 'def decompose_intake(raw: dict):\n    errors = []\n    clean = {}\n    for k, v in raw.items():\n        if v is None or (isinstance(v, str) and not v.strip()):\n            errors.append(k)\n        else:\n            clean[k] = v.strip() if isinstance(v, str) else v\n    return clean, errors\nprint(decompose_intake({"nombres": " Ana ", "edad": ""}))\n', 'descomposicion clean/errors.' if A else 'separacion de responsabilidades.', ['decompose']))
    out.append(ex('S05-T4-A-E1', 'def total_lineas(montos):\n    t = 0\n    for m in montos:\n        t += m\n    return t\nprint(total_lineas([10, 20, 5]))\n', 'acumulador en funcion.' if A else '35.', ['sum']))
    out.append(ex('S05-T4-A-E2', 'def mean(xs):\n    if not xs:\n        return None\n    return sum(xs) / len(xs)\nprint(mean([2, 4, 6]), mean([]))\n', 'media o None si vacio.' if A else 'evita ZeroDivision.', ['mean']))
    out.append(ex('S05-T4-A-E3', 'def reject_rate(statuses):\n    n = len(statuses)\n    if n == 0:\n        return None\n    return sum(1 for s in statuses if s == "reject") / n\nprint(reject_rate(["accept", "reject"]), reject_rate([]))\n', 'tasa reutilizable.' if A else '0.5 y None.', ['rate']))
    out.append(ex('S05-T4-B-E1', 'def main():\n    print("demo funciones S05")\nif __name__ == "__main__":\n    main()\n', 'entrypoint main + __name__.' if A else 'CLI demo minima.', ['main']))
    out.append(ex('S05-T4-B-E2', 'def build_api():\n    def health():\n        return {"status": "ok"}\n    return {"health": health}\napi = build_api()\nprint(api["health"]())\n', 'fabrica de funciones/API simple.' if A else 'health ok.', ['factory']))
    out.append(ex('S05-T4-B-E3', 'def document_contract(fn):\n    return {\n        "name": fn.__name__,\n        "doc": (fn.__doc__ or "").strip(),\n    }\ndef parse_monto(s: str) -> str:\n    """Normaliza monto textual strip."""\n    return s.strip()\nprint(document_contract(parse_monto))\n', 'metadatos de contrato.' if A else 'docstring exportable.', ['docs']))
    return out
