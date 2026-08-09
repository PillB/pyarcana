
# ========== S06 ==========

def s06_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 1, "xs[-2:] con [1,2,3,4] es [3,4] (ultimos dos)."),
            sc(1, 3, "b=a alias: append en b muta a tambien."),
            sc(2, 0, "Conflictos de id con payload distinto se listan, no se silencian."),
            sc(3, 2, "list.sort retorna None y muta in-place."),
            sc(4, 1, "json.dumps sort_keys ayuda a salidas deterministas."),
        ]
    return [
        sc(0, 1, "Slicing negativo: desde el penultimo hasta el final."),
        sc(1, 3, "Teoria de alias de listas mutables."),
        sc(2, 0, "Politica de conflicts en dedupe del paquete."),
        sc(3, 2, "sort in-place vs sorted que retorna lista."),
        sc(4, 1, "Reproducibilidad con sort_keys=True."),
    ]

def s06_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S06-T1-A-E1', 'txs = [10, 20, 30, 40, 50]\nprint(txs[-2:])\nprint(len(txs[-2:]))\n', 'ultimos 2 y longitud ventana.' if A else 'slicing [-2:].', ['slice']))
    out.append(ex('S06-T1-A-E2', 'xs = [1, 2, 3, 4]\nprint(xs[1:3], xs[:2], xs[2:])\n', 'rebanadas basicas.' if A else 'inicio:fin exclusivo.', ['slice']))
    out.append(ex('S06-T1-A-E3', 'window = [1, 2, 3, 4, 5, 6]\nk = 3\nprint([window[i:i+k] for i in range(0, len(window), k)])\n', 'ventanas de tamano k.' if A else 'chunks sin perder orden.', ['chunks']))
    out.append(ex('S06-T1-B-E1', 'a = [1, 2]\nb = a\nb.append(3)\nprint(a, a is b)\n', 'alias muta a.' if A else 'a is b True.', ['alias']))
    out.append(ex('S06-T1-B-E2', 'a = [1, 2]\nc = a.copy()\nc.append(9)\nprint(a, c, a is c)\n', 'copy independiza.' if A else 'a intacto.', ['copy']))
    out.append(ex('S06-T1-B-E3', 'rows = [{"id": 1}, {"id": 2}]\nshallow = rows[:]\nshallow[0]["id"] = 99\nprint(rows[0]["id"])  # 99 shallow\nimport copy\ndeep = copy.deepcopy(rows)\ndeep[0]["id"] = 1\nprint(rows[0]["id"], deep[0]["id"])\n', 'shallow vs deepcopy de dicts.' if A else 'mutacion anidada.', ['deepcopy']))
    out.append(ex('S06-T2-A-E1', 'd = {"a": 1, "b": 2}\nprint(d.get("a"), d.get("c", 0))\n', 'get con default.' if A else 'evita KeyError.', ['dict']))
    out.append(ex('S06-T2-A-E2', 'd = {"nombres": "Ana", "edad": 30}\nfor k, v in d.items():\n    print(k, v)\n', 'items() iteracion.' if A else 'pares clave valor.', ['items']))
    out.append(ex('S06-T2-A-E3', 'raw = [("C1", "accept"), ("C2", "reject"), ("C1", "review")]\nby_id = {}\nconflicts = []\nfor i, st in raw:\n    if i in by_id and by_id[i] != st:\n        conflicts.append({"id": i, "prev": by_id[i], "new": st})\n    by_id[i] = st\nprint(by_id, conflicts)\n', 'dedupe con lista de conflicts.' if A else 'no silenciar colision.', ['conflicts']))
    out.append(ex('S06-T2-B-E1', 's = {1, 2, 2, 3}\nprint(s, 2 in s)\n', 'set elimina duplicados.' if A else 'membership in.', ['set']))
    out.append(ex('S06-T2-B-E2', 'a, b = {1, 2, 3}, {2, 3, 4}\nprint(a & b, a | b, a - b)\n', 'interseccion union diferencia.' if A else 'ops de conjuntos.', ['set ops']))
    out.append(ex('S06-T2-B-E3', 'seen = set()\norder = []\nfor x in ["a", "b", "a", "c", "b"]:\n    if x not in seen:\n        seen.add(x)\n        order.append(x)\nprint(order)\n', 'unicos preservando orden.' if A else 'set + lista.', ['unique']))
    out.append(ex('S06-T3-A-E1', 'rows = [{"id": "b"}, {"id": "a"}, {"id": "c"}]\nrows.sort(key=lambda r: r["id"])\nprint(rows)\n', 'sort in-place por id.' if A else 'retorna None implicitamente.', ['sort']))
    out.append(ex('S06-T3-A-E2', 'rows = [{"score": 2}, {"score": 5}, {"score": 1}]\nprint(sorted(rows, key=lambda r: r["score"], reverse=True))\n', 'sorted no muta original.' if A else 'orden descendente.', ['sorted']))
    out.append(ex('S06-T3-A-E3', 'from operator import itemgetter\nrows = [{"id": "C2", "n": 1}, {"id": "C1", "n": 2}]\nprint(sorted(rows, key=itemgetter("id")))\n', 'itemgetter como key.' if A else 'alternativa a lambda.', ['itemgetter']))
    out.append(ex('S06-T3-B-E1', 't = (1, 2, 3)\nprint(t[0], len(t))\n# t[0] = 9  # TypeError si se descomenta\nprint("tuple inmutable")\n', 'tupla indexable e inmutable.' if A else 'buen key de dict.', ['tuple']))
    out.append(ex('S06-T3-B-E2', 'pair = ("C1", "accept")\ni, st = pair\nprint(i, st)\n', 'unpacking de tupla.' if A else 'patron de pares.', ['unpack']))
    out.append(ex('S06-T3-B-E3', 'from collections import Counter\nprint(Counter(["accept", "reject", "accept"]))\n', 'Counter de statuses.' if A else 'frecuencias.', ['Counter']))
    out.append(ex('S06-T4-A-E1', 'import json\nprint(json.dumps({"b": 1, "a": 2}, sort_keys=True))\n', 'sort_keys determinista.' if A else 'salida estable.', ['json']))
    out.append(ex('S06-T4-A-E2', 'import json\ns = json.dumps([{"id": "C1"}], ensure_ascii=False)\nprint(s)\nprint(json.loads(s)[0]["id"])\n', 'dumps/loads round-trip.' if A else 'ensure_ascii False.', ['json']))
    out.append(ex('S06-T4-A-E3', 'import json\npayload = {"ids": ["C1", "C2"], "n": 2}\nprint(json.dumps(payload, sort_keys=True, indent=2))\n', 'indent para lectura humana.' if A else 'contrato serializado.', ['json']))
    out.append(ex('S06-T4-B-E1', 'records = [{"id": "C1"}, {"id": "C1"}, {"id": "C2"}]\nby = {}\nfor r in records:\n    by.setdefault(r["id"], []).append(r)\nprint({k: len(v) for k, v in by.items()})\n', 'groupby manual con setdefault.' if A else 'conteo por id.', ['groupby']))
    out.append(ex('S06-T4-B-E2', 'from collections import defaultdict\ng = defaultdict(list)\nfor r in [{"region": "Lima"}, {"region": "Cusco"}, {"region": "Lima"}]:\n    g[r["region"]].append(r)\nprint(dict(g))\n', 'defaultdict list.' if A else 'agrupar por region.', ['defaultdict']))
    out.append(ex('S06-T4-B-E3', 'def merge_unique(rows):\n    seen = {}\n    conflicts = []\n    for r in rows:\n        i = r["id"]\n        if i in seen and seen[i] != r:\n            conflicts.append(i)\n        seen[i] = r\n    return list(seen.values()), conflicts\nprint(merge_unique([{"id": "A", "v": 1}, {"id": "A", "v": 2}, {"id": "B", "v": 1}]))\n', 'merge con conflicts.' if A else 'ultima gana pero traza conflicto.', ['merge']))
    return out
