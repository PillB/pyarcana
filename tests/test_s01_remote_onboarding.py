from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
S01 = ROOT / "src/lib/course/sections/s01-setup.ts"


def test_s01_teaches_remote_creation_and_auth_before_public_repo_requirement():
    source = S01.read_text(encoding="utf-8")
    before_you_do = source.split("  youDo:", 1)[0]

    required_learner_steps = [
        "cuenta de GitHub",
        "New repository",
        "git remote add origin",
        "git remote -v",
        "git push -u origin",
        "gh auth login --web",
        "Compare & pull request",
    ]
    missing = [step for step in required_learner_steps if step not in before_you_do]
    assert not missing, (
        "S01 requires a public repository/PR in You Do before teaching the "
        f"remote onboarding path; missing: {missing}"
    )
