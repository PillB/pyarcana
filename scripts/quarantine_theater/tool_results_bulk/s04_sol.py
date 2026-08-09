
# ========== SECTION 04 ==========

def s04_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 3, "list(range(3)) produce [0,1,2]: range empieza en 0 y excluye el tope."),
            sc(1, 1, "zip sin strict recorta al mas corto: empareja (1,10)(2,20) y el 3 se pierde en silencio."),
            sc(2, 2, "Tasa de reject usa n_total de registros procesados como denominador del gate."),
            sc(3, 0, "continue salta al siguiente ciclo del for sin terminar el programa."),
            sc(4, 3, "Doble for anidado sobre n elementos es O(n^2) aproximadamente."),
        ]
    return [
        sc(0, 3, "Teoria de range: stop exclusivo da tres valores 0,1,2."),
        sc(1, 1, "S04 zip silencioso trunca; strict lanzaria ValueError."),
        sc(2, 2, "Denominador = intentados/total, no solo accept ni 100 fijo."),
        sc(3, 0, "continue avanza la iteracion actual del bucle de lineas."),
        sc(4, 3, "Anidamiento n x n es cuadratico."),
    ]

def s04_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S04-T1-A-E1', 'regiones = ["Lima", "Cusco", "Piura"]\nfor r in regiones:\n    print(r)\nprint(list(range(3)))\n', 'for sobre regiones y list(range(3)) -> [0,1,2].' if A else 'Iteracion basica + range del paquete S04.', ['for', 'range']))
    out.append(ex('S04-T1-A-E2', 'edades = [30, 17, 45, 22]\nn = 0\nfor e in edades:\n    if e >= 18:\n        n += 1\nprint(n)\n', 'Contador con for; n==3.' if A else 'Mayores de edad sin comprehension.', ['count']))
    out.append(ex('S04-T1-A-E3', 'lote = [{"id": "C1", "monto": 10}, {"id": "C2", "monto": 0}, {"id": "C3", "monto": -2}, {"id": "C4", "monto": 5}]\nfor reg in lote:\n    if reg["monto"] > 0:\n        print(reg["id"])\n', 'Solo ids con monto>0: C1 y C4.' if A else 'Filtro de mini-lote por monto positivo.', ['filter']))
    out.append(ex('S04-T1-B-E1', 'ids = ["A", "B", "C"]\nfor i, x in enumerate(ids, start=1):\n    print(f"fila {i}: {x}")\n', 'enumerate start=1.' if A else 'Indices 1-based para filas.', ['enumerate']))
    out.append(ex('S04-T1-B-E2', 'nombres = ["Ana", "Luis", "Maria"]\nedades = [30, 25, 40]\nfor n, e in zip(nombres, edades):\n    print(f"{n}={e}")\nfor n, e in zip(nombres, edades[:2]):\n    print("corto", n, e)\n', 'zip completo + demo truncado.' if A else '3 pares y zip silencioso.', ['zip']))
    out.append(ex('S04-T1-B-E3', 'def zip_strict(a, b):\n    if len(a) != len(b):\n        raise ValueError("longitudes distintas")\n    return list(zip(a, b))\ntry:\n    zip_strict([1, 2, 3], [10, 20])\nexcept ValueError:\n    print("DESALINEADO")\ntry:\n    zip_strict([1, 2], [3, 4])\n    print("OK")\nexcept ValueError:\n    print("DESALINEADO")\n', 'zip_strict pedagogico.' if A else 'ValueError si lens difieren.', ['zip_strict']))
    out.append(ex('S04-T2-A-E1', 'lines = ["r1", "r2", "", "r3"]\ni = 0\nout = []\nwhile i < len(lines):\n    line = lines[i]\n    i += 1\n    if line == "":\n        break\n    out.append(line)\nprint(out)\n', "while+break -> ['r1','r2']." if A else 'Buffer hasta centinela vacio.', ['while']))
    out.append(ex('S04-T2-A-E2', 'intentos = 0\nMAX = 3\nwhile intentos < MAX:\n    intentos += 1\n    print(f"intento {intentos}")\nprint("done", intentos)\n', '3 reintentos + done 3.' if A else 'Loop de reintentos.', ['retries']))
    out.append(ex('S04-T2-A-E3', 'cola = ["job1", "job2", "job3"]\nwhile cola:\n    job = cola.pop(0)\n    print(job)\n    if job == "job2":\n        print("PAUSE")\n        break\nprint("rest", cola)\n', 'pause en job2; rest [job3].' if A else 'Cola FIFO con break.', ['queue']))
    out.append(ex('S04-T2-B-E1', 'raw = ["  ", "Lima", "", "Cusco"]\nfor x in raw:\n    if not x.strip():\n        continue\n    print(x)\n', 'continue salta vacios.' if A else 'Lima y Cusco validos.', ['continue']))
    out.append(ex('S04-T2-B-E2', 'codes = [200, 200, 500, 200]\nn_ok = 0\nfor c in codes:\n    if c >= 500:\n        print("STOP")\n        break\n    n_ok += 1\n    print("ok")\nprint("n_ok", n_ok)\n', 'ok ok STOP n_ok 2.' if A else 'break en 5xx.', ['break']))
    out.append(ex('S04-T2-B-E3', 'buf = ["a", "b", "END"]\ni = 0\nout = []\nwhile True:\n    if i > 10:\n        raise RuntimeError("guard")\n    item = buf[i]\n    i += 1\n    if item == "END":\n        break\n    out.append(item)\nprint(out)\n', 'while True + END + guard.' if A else "['a','b'].", ['while True']))
    out.append(ex('S04-T3-A-E1', 'sts = ["accept", "reject", "accept"]\nn_accept = n_reject = n_total = 0\nfor s in sts:\n    n_total += 1\n    if s == "accept":\n        n_accept += 1\n    elif s == "reject":\n        n_reject += 1\nprint(n_accept, n_reject, n_total)\n', '2 1 3.' if A else 'Contadores de status.', ['counters']))
    out.append(ex('S04-T3-A-E2', 'def tasa_reject(sts):\n    n_total = len(sts)\n    if n_total == 0:\n        return None\n    n_reject = sum(1 for s in sts if s == "reject")\n    return n_reject / n_total\nprint(tasa_reject(["accept", "reject", "accept"]))\nprint(tasa_reject([]))\n', '0.333... y None.' if A else 'Sin ZeroDivisionError.', ['rate']))
    out.append(ex('S04-T3-A-E3', 'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "review"}, {"id": "C3", "status": "review"}]\nidx = -1\nfound_id = None\nfor i, r in enumerate(rows):\n    if r["status"] == "review":\n        idx = i\n        found_id = r["id"]\n        break\nprint(idx, found_id)\n', '1 C2 primer review.' if A else 'Busqueda lineal con break.', ['search']))
    out.append(ex('S04-T3-B-E1', 'nums = [1, 2, 3, 4, 5]\nprint([x * x for x in nums])\nprint([x for x in nums if x % 2 == 0])\n', 'cuadrados y pares.' if A else 'list comprehensions.', ['comp']))
    out.append(ex('S04-T3-B-E2', 'rows = [{"status": "reject"}, {"status": "accept"}, {"status": "reject"}, {"status": "review"}]\nprint(sorted({r["status"] for r in rows}))\n', 'statuses unicos ordenados.' if A else 'set + sorted.', ['set']))
    out.append(ex('S04-T3-B-E3', 'rows = [{"id": "C1", "status": "accept"}, {"id": "C2", "status": "reject"}, {"id": "C3", "status": "accept"}, {"id": "C4", "status": "reject"}]\nby = {r["id"]: r["status"] for r in rows}\nrejects = [i for i, st in by.items() if st == "reject"]\nprint("reject", rejects, len(rejects) / len(rows))\n', 'C2 C4 tasa 0.5.' if A else 'dict + list comp.', ['dictcomp']))
    out.append(ex('S04-T4-A-E1', 'vals = [2, -1, 3]\ns = 0\nfor i, val in enumerate(vals):\n    if val > 0:\n        s += val\n    print(i, val, s)\nprint("final", s)\n', 'traza final 5.' if A else 'acumulador positivos.', ['trace']))
    out.append(ex('S04-T4-A-E2', 'filas = ["a", "b", "c"]\nn = 0\nfor f in filas:\n    n += 1\nprint(n)\n', 'n=3 corregido.' if A else 'un incremento por fila.', ['bugfix']))
    out.append(ex('S04-T4-A-E3', 'regs = ["accept", "reject", "accept"]\ncounts = {"accept": 0, "reject": 0}\nfor i, st in enumerate(regs):\n    counts[st] = counts.get(st, 0) + 1\n    print("TRACE", i, st, dict(counts))\n', 'TRACE por registro.' if A else 'estado del dict cada paso.', ['TRACE']))
    out.append(ex('S04-T4-B-E1', 'sts = ["accept", "accept", "reject", "review", "accept"]\nn_total = len(sts)\nn_accept = sum(1 for s in sts if s == "accept")\nn_reject = sum(1 for s in sts if s == "reject")\nn_review = sum(1 for s in sts if s == "review")\nprint({"n_total": n_total, "n_accept": n_accept, "n_reject": n_reject, "n_review": n_review,\n       "tasa_reject": n_reject / n_total if n_total else None})\n', 'resumen con tasa_reject.' if A else 'metricas del lote.', ['summary']))
    out.append(ex('S04-T4-B-E2', 'rows = [\n    {"id": "C1", "status": "accept", "monto": 10},\n    {"id": "C2", "status": "reject", "monto": 0},\n    {"id": "C3", "status": "accept", "monto": 5},\n]\nclean = [r for r in rows if r["status"] == "accept"]\nprint("clean_ids", [r["id"] for r in clean])\nprint("n_clean", len(clean), "n_total", len(rows))\n', 'filtra accept.' if A else 'clean vs total.', ['clean']))
    out.append(ex('S04-T4-B-E3', 'def batch_report(rows):\n    n_total = len(rows)\n    n_reject = sum(1 for r in rows if r.get("status") == "reject")\n    return {\n        "n_total": n_total,\n        "n_reject": n_reject,\n        "tasa_reject": (n_reject / n_total) if n_total else None,\n        "ids": [r["id"] for r in rows],\n    }\nprint(batch_report([{"id": "A", "status": "accept"}, {"id": "B", "status": "reject"}]))\nprint(batch_report([]))\n', 'reporte reutilizable; vacio -> None.' if A else 'You Do style summary.', ['report']))
    return out
