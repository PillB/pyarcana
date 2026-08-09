
# ========== S07 ==========

def s07_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 2, "Jose precompuesto vs NFD pueden fallar en ==; hay que normalizar NFC."),
            sc(1, 0, "Un solo token en nombre latam: review y conservar raw, no inventar apellido."),
            sc(2, 1, "Preferir replace/split cuando la transformacion es literal/simple."),
            sc(3, 3, "fullmatch de solo digitos sobre 'DNI 12345678' devuelve None."),
            sc(4, 2, "Jaccard 0.67 debe ir a review con evidencia, no fusion automatica."),
        ]
    return [
        sc(0, 2, "S07-T1-A: formas Unicode NFC vs NFD."),
        sc(1, 0, "Politica segura de parsing de nombres incompletos."),
        sc(2, 1, "Regex no siempre; str ops primero."),
        sc(3, 3, "fullmatch exige toda la cadena."),
        sc(4, 2, "Score intermedio = clerical review."),
    ]

def s07_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S07-T1-A-E1', 'import unicodedata\na = "José"\nb = "Jose\\u0301"\nprint("raw equal?", a == b)\nprint("NFC equal?", unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))\nprint("casefold:", "MAÑANA".casefold())\n', 'NFC alinea Jose compuesto vs NFD.' if A else 'code points y casefold.', ['unicode']))
    out.append(ex('S07-T1-A-E2', 'import unicodedata\ndef nfc(s):\n    return unicodedata.normalize("NFC", s)\nprint(nfc("Jose\\u0301") == nfc("José"))\n', 'helper NFC para igualdad estable.' if A else 'normalizacion antes de ==.', ['NFC']))
    out.append(ex('S07-T1-A-E3', 'import unicodedata\ndef fingerprint(s):\n    return unicodedata.normalize("NFC", s).casefold().strip()\nprint(fingerprint("  MAÑANA  "), fingerprint("mañana"))\n', 'fingerprint NFC+casefold+strip.' if A else 'clave de matching textual.', ['fingerprint']))
    out.append(ex('S07-T1-B-E1', 'raw = "  María   del  Carmen  Quispe  Huamán "\ntokens = raw.split()\nprint(tokens)\nif len(tokens) >= 3:\n    ap2, ap1 = tokens[-1], tokens[-2]\n    given = " ".join(tokens[:-2])\n    print("given:", given)\n    print("apellidos:", ap1, ap2)\n', 'heuristica ultimos 2 tokens apellidos.' if A else 'conserva raw en pipeline.', ['names']))
    out.append(ex('S07-T1-B-E2', 'def split_name(raw):\n    toks = raw.split()\n    if len(toks) < 2:\n        return {"raw": raw, "status": "review", "given": None, "apellidos": None}\n    return {"raw": raw, "status": "ok", "given": " ".join(toks[:-2]) if len(toks) > 2 else toks[0],\n            "apellidos": toks[-2:] if len(toks) >= 2 else toks}\nprint(split_name("Ana"))\nprint(split_name("Ana Quispe Huamán"))\n', 'un token -> review + raw.' if A else 'no inventar apellido2.', ['policy']))
    out.append(ex('S07-T1-B-E3', 'particulas = {"de", "del", "la", "los", "las", "y"}\ndef tokens_name(s):\n    return [t for t in s.split() if t.casefold() not in particulas or True]\n# demo: mantener particulas en given\nraw = "María del Carmen Quispe"\nprint(raw.split())\n', 'particulas en nombres compuestos.' if A else 'no borrar del/de sin politica.', ['particles']))
    out.append(ex('S07-T2-A-E1', 'dir_raw = "  Av.  Larco   123  ,  Miraflores "\nlimpio = " ".join(dir_raw.strip().split())\nprint(limpio)\nprint([p.strip() for p in limpio.split(",")])\nprint(limpio.replace("Av.", "Avenida"))\n', 'split/join colapsa espacios; replace literal.' if A else 'ops str antes de regex.', ['str ops']))
    out.append(ex('S07-T2-A-E2', 's = "Jr. de la Unión 450"\nprint(s.find("Unión"), s.replace("Jr.", "Jiron"))\n', 'find + replace.' if A else 'busqueda literal.', ['find']))
    out.append(ex('S07-T2-A-E3', 'def normalize_address(raw):\n    return " ".join(raw.strip().split())\nprint(normalize_address("  Jr.   Ucayali  100 "))\n', 'normalizador de direccion minimo.' if A else 'idempotente strip/split/join.', ['address']))
    out.append(ex('S07-T2-B-E1', 'def normalize_email(raw: str) -> str:\n    s = raw.strip().casefold()\n    if s.count("@") != 1 or any(ch.isspace() for ch in s):\n        raise ValueError("email requiere un @ y cero espacios")\n    local, domain = s.split("@")\n    if not local or not domain:\n        raise ValueError("email requiere local y dominio")\n    return s\nprint(normalize_email("  Ana+test@Example.COM "))\n', 'email strip/casefold un @.' if A else 'sin sobrevalidar TLD.', ['email']))
    out.append(ex('S07-T2-B-E2', 'def normalize_phone_pe(raw: str) -> str:\n    return "".join(c for c in raw if c.isdigit())\nprint(normalize_phone_pe("+51 999-000-111"))\n', 'solo digitos del telefono.' if A else 'no aritmetica.', ['phone']))
    out.append(ex('S07-T2-B-E3', 'def validate_contact(email=None, phone=None):\n    errors = []\n    if email is not None and email.count("@") != 1:\n        errors.append("email")\n    if phone is not None and not any(ch.isdigit() for ch in phone):\n        errors.append("phone")\n    return errors\nprint(validate_contact("a@b.com", "999"), validate_contact("bad", "xxx"))\n', 'validacion ligera contactos.' if A else 'errores nombrados.', ['contact']))
    out.append(ex('S07-T3-A-E1', 'import re\npat = re.compile(r"^(?P<dni>\\d{8})$")\nm = pat.fullmatch("12345678")\nprint(m.group("dni") if m else None)\nprint("search mid:", bool(re.search(r"\\d{8}", "DNI 12345678 PE")))\nprint("full mid:", bool(re.fullmatch(r"\\d{8}", "DNI 12345678 PE")))\n', 'fullmatch vs search.' if A else 'grupo nombrado dni.', ['re']))
    out.append(ex('S07-T3-A-E2', 'import re\nprint(bool(re.fullmatch(r"\\d{8}", "12345678")))\nprint(bool(re.fullmatch(r"\\d{8}", "DNI 12345678")))\n', 'fullmatch None en prefijo.' if A else 'anclas implicitas full.', ['fullmatch']))
    out.append(ex('S07-T3-A-E3', 'import re\npat = re.compile(r"DNI\\s+(?P<dni>\\d{8})\\b")\nm = pat.search("Cliente demo DNI 12345678 activo")\nprint(m.group("dni") if m else None)\n', 'extraccion con search + grupo.' if A else 'word boundary.', ['search']))
    out.append(ex('S07-T3-B-E1', 'import re\nphone = re.compile(r"\\b9\\d{8}\\b")\nlog = "llamada 999000111 y fallback 988777666 fin"\nprint(phone.findall(log))\n', 'findall celulares 9xxxxxxxx.' if A else 'patron compilado.', ['findall']))
    out.append(ex('S07-T3-B-E2', 'import re\nphone = re.compile(r"\\b9\\d{8}\\b")\nlog = "ok 999111222 noise 12345 otro 988777666"\nfor m in phone.finditer(log):\n    print(m.group(), "at", m.start())\n', 'finditer con span.' if A else 'posiciones en log.', ['finditer']))
    out.append(ex('S07-T3-B-E3', 'import re\n# evita cuantificadores anidados ambiguos; usa findall acotado\nprint(re.findall(r"\\b\\d{8}\\b", "ids 12345678 y 87654321"))\n', 'extraccion acotada de 8 digitos.' if A else 'limites \\b.', ['limits']))
    out.append(ex('S07-T4-A-E1', 'def token_jaccard(a: str, b: str) -> float:\n    A = set(a.replace(".", " ").casefold().split())\n    B = set(b.replace(".", " ").casefold().split())\n    if not A and not B:\n        return 1.0\n    if not A or not B:\n        return 0.0\n    return len(A & B) / len(A | B)\nprint(round(token_jaccard("Juan Perez", "Juan P. Perez"), 3))\n', 'Jaccard de tokens ~0.67.' if A else 'set intersection/union.', ['jaccard']))
    out.append(ex('S07-T4-A-E2', 'def token_jaccard(a, b):\n    A, B = set(a.casefold().split()), set(b.casefold().split())\n    if not A or not B:\n        return 0.0\n    return len(A & B) / len(A | B)\nprint(round(token_jaccard("Ana Quispe", "Luis Huamán"), 3))\n', 'nombres disjuntos -> 0.' if A else 'score bajo.', ['jaccard']))
    out.append(ex('S07-T4-A-E3', 'def decide_name_match(score):\n    if score >= 0.99:\n        return "exact"\n    if score >= 0.5:\n        return "review"\n    return "no_match"\nprint(decide_name_match(1.0), decide_name_match(0.67), decide_name_match(0.1))\n', '0.67 -> review no merge auto.' if A else 'umbrales de evidencia.', ['decision']))
    out.append(ex('S07-T4-B-E1', 'pairs = [\n    ("José Pérez", "Jose Perez", 0.9, "review"),\n    ("Ana", "Ana", 1.0, "exact"),\n    ("Luis", "Carla", 0.0, "no_match"),\n]\nfor a, b, score, dec in pairs:\n    print(f"{a!r} vs {b!r} score={score} -> {dec}")\nprint("nota: sin claims de parentesco ni identidad legal")\n', 'tabula FP/FN sin veredictos legales.' if A else 'conserva evidencia.', ['evidence']))
    out.append(ex('S07-T4-B-E2', '# metricas sinteticas\nrows = [\n    {"pred": "match", "truth": "match"},\n    {"pred": "match", "truth": "no"},  # FP\n    {"pred": "no", "truth": "match"},  # FN\n    {"pred": "no", "truth": "no"},\n]\ntp = sum(1 for r in rows if r["pred"]=="match" and r["truth"]=="match")\nfp = sum(1 for r in rows if r["pred"]=="match" and r["truth"]=="no")\nfn = sum(1 for r in rows if r["pred"]=="no" and r["truth"]=="match")\nprint("tp", tp, "fp", fp, "fn", fn)\n', 'tp/fp/fn de matching sintético.' if A else 'FP no implica fraude.', ['metrics']))
    out.append(ex('S07-T4-B-E3', 'def keep_evidence(raw_a, raw_b, score, decision):\n    return {"raw_a": raw_a, "raw_b": raw_b, "score": score, "decision": decision,\n            "legal_claim": False}\nprint(keep_evidence("Ana", "Ana Quispe", 0.5, "review"))\n', 'raw + score + decision; sin claim legal.' if A else 'paquete de evidencia.', ['keep raw']))
    return out
