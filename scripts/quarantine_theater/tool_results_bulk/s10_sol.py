
# ========== S10 ==========

def s10_selfcheck(persona: str):
    if persona == "explorer":
        return [
            sc(0, 1, "if __name__ == '__main__' ejecuta CLI solo al correr el modulo, no al importar."),
            sc(1, 3, "Precedencia: flags > env > file > defaults."),
            sc(2, 0, "Exit code 2 suele ser error de uso/parseo argparse."),
            sc(3, 2, "Logs de progreso van a stderr."),
            sc(4, 1, "Subcomando nuevo compatible tipicamente minor."),
            sc(5, 3, ".env con API_TOKEN no debe ir al git del paquete."),
        ]
    return [
        sc(0, 1, "Patron entrypoint de modulos S10."),
        sc(1, 3, "Tabla de precedencia de config del paquete."),
        sc(2, 0, "Convencion argparse exit 2."),
        sc(3, 2, "stdout reservado a datos."),
        sc(4, 1, "SemVer: feature compatible = minor."),
        sc(5, 3, "Secretos fuera del repo."),
    ]

def s10_exercises(persona: str):
    A = persona == "explorer"
    out = []
    out.append(ex('S10-T1-A-E1', 'def greet(name):\n    return f"hola {name}"\ndef main():\n    print(greet("mundo"))\nif __name__ == "__main__":\n    main()\n', 'modulo importable + main.' if A else 'no side effects al import.', ['__main__']))
    out.append(ex('S10-T1-A-E2', '# paquete minimo\n# mypkg/__init__.py vacio + mypkg/cli.py con main\nprint(__name__)\n', 'nombre del modulo al import/run.' if A else 'base packaging.', ['package']))
    out.append(ex('S10-T1-A-E3', '__all__ = ["parse_row"]\ndef parse_row(r):\n    return r\nprint(__all__)\n', '__all__ exporta API publica.' if A else 'superficie estable.', ['__all__']))
    out.append(ex('S10-T1-B-E1', 'def load_config(defaults, file_cfg, env, flags):\n    cfg = dict(defaults)\n    cfg.update(file_cfg or {})\n    cfg.update(env or {})\n    cfg.update(flags or {})\n    return cfg\nprint(load_config({"a":1}, {"a":2}, {"a":3}, {"a":4}))\n', 'flags ganan: a=4.' if A else 'precedencia defaults<file<env<flags.', ['config']))
    out.append(ex('S10-T1-B-E2', 'import os\ndef env_or(key, default):\n    return os.environ.get(key, default)\nprint(env_or("NOEXISTE_PYARCANA", "def"))\n', 'lee env con default.' if A else 'capa env.', ['env']))
    out.append(ex('S10-T1-B-E3', 'def merge_cfg(*layers):\n    out = {}\n    for layer in layers:\n        if layer:\n            out.update(layer)\n    return out\nprint(merge_cfg({"x":1}, {"x":2, "y":3}))\n', 'merge de capas de config.' if A else 'ultima gana.', ['merge']))
    out.append(ex('S10-T2-A-E1', 'import argparse\np = argparse.ArgumentParser()\np.add_argument("--n", type=int, default=1)\n# args = p.parse_args([])  # en demo\nprint(p.parse_args([]).n)\n', 'argparse default n=1.' if A else 'CLI basica.', ['argparse']))
    out.append(ex('S10-T2-A-E2', 'import argparse\np = argparse.ArgumentParser()\np.add_argument("path")\nprint(p.parse_args(["data.csv"]).path)\n', 'positional path.' if A else 'uso tipico ingest.', ['args']))
    out.append(ex('S10-T2-A-E3', 'import argparse, sys\np = argparse.ArgumentParser()\np.add_argument("--strict", action="store_true")\nprint(p.parse_args([]).strict, p.parse_args(["--strict"]).strict)\n', 'flag boolean store_true.' if A else 'strict mode.', ['flags']))
    out.append(ex('S10-T2-B-E1', 'def exit_usage():\n    raise SystemExit(2)\ntry:\n    exit_usage()\nexcept SystemExit as e:\n    print("code", e.code)\n', 'exit 2 uso/parseo.' if A else 'convencion argparse.', ['exit 2']))
    out.append(ex('S10-T2-B-E2', 'def run(ok):\n    return 0 if ok else 1\nprint(run(True), run(False))\n', '0 exito 1 error de negocio.' if A else 'codigos de salida.', ['exit codes']))
    out.append(ex('S10-T2-B-E3', 'import sys\nprint("json-out")\nprint("progress", file=sys.stderr)\n', 'progreso a stderr.' if A else 'stdout limpio.', ['stderr']))
    out.append(ex('S10-T3-A-E1', '# pyproject snippet\ntoml = \nprint("0.1.0")\n', 'version inicial package.' if A else 'SemVer base.', ['version']))
    out.append(ex('S10-T3-A-E2', 'def bump(ver, kind):\n    maj, mi, pa = map(int, ver.split("."))\n    if kind == "major":\n        return f"{maj+1}.0.0"\n    if kind == "minor":\n        return f"{maj}.{mi+1}.0"\n    return f"{maj}.{mi}.{pa+1}"\nprint(bump("0.1.0", "minor"), bump("0.1.0", "patch"))\n', 'minor por subcomando nuevo.' if A else '0.2.0 y 0.1.1.', ['semver']))
    out.append(ex('S10-T3-A-E3', 'changelog = ["0.2.0: add validate subcommand", "0.1.0: initial cli"]\nprint("\\n".join(changelog))\n', 'changelog minimo.' if A else 'comunicar cambios.', ['changelog']))
    out.append(ex('S10-T3-B-E1', 'ignore = [".env", "*.pyc", ".venv/", "dist/"]\nprint("\\n".join(ignore))\n', 'artefactos y secretos fuera de git.' if A else 'packaging hygiene.', ['gitignore']))
    out.append(ex('S10-T3-B-E2', '# no commitear\nsecret_paths = [".env", "secrets.yaml"]\nprint(secret_paths)\n', 'lista de paths prohibidos.' if A else 'API_TOKEN fuera.', ['secrets']))
    out.append(ex('S10-T3-B-E3', 'readme = "pip install -e .\\npython -m mypkg.cli --help"\nprint(readme)\n', 'docs de install editable + help.' if A else 'onboarding CLI.', ['readme']))
    out.append(ex('S10-T4-A-E1', 'def subcommands():\n    return {"ingest": "run ingest", "validate": "run validate"}\nprint(sorted(subcommands()))\n', 'mapa de subcomandos.' if A else 'CLI multi-command.', ['subcommands']))
    out.append(ex('S10-T4-A-E2', 'def dispatch(cmd, registry):\n    if cmd not in registry:\n        raise SystemExit(2)\n    return registry[cmd]\nprint(dispatch("ingest", {"ingest": "ok"}))\n', 'dispatch con exit 2 si desconocido.' if A else 'router CLI.', ['dispatch']))
    out.append(ex('S10-T4-A-E3', 'help_text = "usage: tool [ingest|validate] [--strict]"\nprint(help_text)\n', 'help de uso.' if A else 'documenta interface.', ['help']))
    out.append(ex('S10-T4-B-E1', 'def smoke_cli():\n    return {"exit": 0, "stdout": "{\\"ok\\": true}"}\nprint(smoke_cli())\n', 'smoke del CLI.' if A else 'exit 0 + json.', ['smoke']))
    out.append(ex('S10-T4-B-E2', 'checklist = ["entry __main__", "stderr logs", "no .env in sdist"]\nprint(checklist)\n', 'checklist release package.' if A else 'higiene.', ['release']))
    out.append(ex('S10-T4-B-E3', 'def public_api():\n    return ["main", "load_config", "dispatch"]\nprint(public_api())\n', 'API publica estable.' if A else 'superficie versionada.', ['api']))
    return out
