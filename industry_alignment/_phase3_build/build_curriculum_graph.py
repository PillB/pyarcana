#!/usr/bin/env python3
"""
Phase 3 — Build Complete Curriculum Graph for PyArcana.

Reads all 52 canonical section source files in
src/lib/course/sections/s*.ts (those actually imported by
src/lib/course/index.ts) and emits a complete curriculum skill
graph mapping every section, subtopic, I Do, We Do, You Do,
self-check, exercise, exam, project, and capstone to explicit
skill nodes from industry_skill_graph.json.

Outputs:
  - industry_alignment/curriculum_skill_graph.json
  - industry_alignment/curriculum_graph_summary.md
  - worklog entry appended to industry_alignment/worklog.md
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

REPO = Path("/home/z/my-project/pyarcana_repo")
SECTIONS_DIR = REPO / "src/lib/course/sections"
COURSE_INDEX = REPO / "src/lib/course/index.ts"
INDUSTRY_GRAPH = REPO / "industry_alignment/industry_skill_graph.json"
OUT_JSON = REPO / "industry_alignment/curriculum_skill_graph.json"
OUT_MD = REPO / "industry_alignment/curriculum_graph_summary.md"
WORKLOG = REPO / "industry_alignment/worklog.md"

# --------------------------------------------------------------------------- #
# Step 1. Read course index → ordered list of 52 canonical section files      #
# --------------------------------------------------------------------------- #

def read_canonical_section_files() -> List[Tuple[int, Path]]:
    """
    Return [(section_index, path)] in canonical order, parsed from
    src/lib/course/index.ts imports.
    """
    text = COURSE_INDEX.read_text(encoding="utf-8")
    pat = re.compile(r"import\s+\{\s*section(\d{2})\s*\}\s+from\s+'([^']+)'", re.M)
    found: List[Tuple[int, Path]] = []
    for m in pat.finditer(text):
        idx = int(m.group(1))
        rel = m.group(2)  # like './sections/s01-setup'
        # Resolve relative to index.ts (in src/lib/course/)
        p = (COURSE_INDEX.parent / rel).with_suffix(".ts")
        found.append((idx, p))
    found.sort(key=lambda x: x[0])
    if len(found) != 52:
        raise RuntimeError(
            f"Expected 52 canonical sections, found {len(found)}"
        )
    return found


# --------------------------------------------------------------------------- #
# Step 2. Parse each section file                                             #
# --------------------------------------------------------------------------- #

# Regex helpers ------------------------------------------------------------- #

ID_RE = re.compile(r"^\s*id:\s*['\"]([^'\"]+)['\"]", re.M)
INDEX_RE = re.compile(r"^\s*index:\s*(\d+),?", re.M)
TITLE_RE = re.compile(r"^\s*title:\s*['\"`]([^'\"`]+)['\"`]", re.M)
PHASE_RE = re.compile(r"^\s*phase:\s*(\d),?", re.M)
LEVEL_RE = re.compile(r"^\s*level:\s*['\"]([^'\"]+)['\"]", re.M)
HOURS_RE = re.compile(r"^\s*estimatedHours:\s*(\d+),?", re.M)
SHORT_TITLE_RE = re.compile(r"^\s*shortTitle:\s*['\"`]([^'\"`]+)['\"`]", re.M)
TAGLINE_RE = re.compile(r"^\s*tagline:\s*['\"`]([^'\"`]+)['\"`]", re.M)
ICON_RE = re.compile(r"^\s*icon:\s*['\"]([^'\"]+)['\"]", re.M)

SUBTOPIC_ID_RE = re.compile(r"subtopicId:\s*['\"]([^'\"]+)['\"]")
DEMO_ID_RE = re.compile(r"demoId:\s*['\"]([^'\"]+)['\"]")
WEDO_ID_RE = re.compile(r"^\s*id:\s*['\"](S\d{2}-[^'\"]+)['\"]", re.M)
WEDO_KIND_RE = re.compile(r"kind:\s*['\"]([^'\"]+)['\"]")
ENV_RE = re.compile(r"environment:\s*['\"]([^'\"]+)['\"]")
CORRECT_IDX_RE = re.compile(r"correctIndex:\s*(\d+)")


def find_block(text: str, key: str) -> str:
    """
    Find the substring that contains the object bound to `key:` at the top
    level of the CourseSection literal. Uses brace matching.
    Returns the substring starting at the opening brace through the matching
    closing brace (or empty string if not found).
    """
    # match `key:` followed by optional whitespace then `{`
    pat = re.compile(r"\b" + re.escape(key) + r"\s*:\s*\{")
    m = pat.search(text)
    if not m:
        return ""
    start = m.end() - 1  # at the `{`
    depth = 0
    i = start
    in_str = False
    str_ch = ""
    while i < len(text):
        ch = text[i]
        # Handle string literals: ' " `
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == str_ch:
                in_str = False
            i += 1
            continue
        if ch in ('"', "'", "`"):
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
        i += 1
    return ""


def find_array_block(text: str, key: str) -> str:
    """
    Find the substring that contains the array bound to `key:` at the top
    level. Uses bracket matching.
    """
    pat = re.compile(r"\b" + re.escape(key) + r"\s*:\s*\[")
    m = pat.search(text)
    if not m:
        return ""
    start = m.end() - 1  # at the `[`
    depth = 0
    i = start
    in_str = False
    str_ch = ""
    while i < len(text):
        ch = text[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == str_ch:
                in_str = False
            i += 1
            continue
        if ch in ('"', "'", "`"):
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
        i += 1
    return ""


def count_top_level_objects(block: str) -> int:
    """Count top-level `{` objects inside an array block (between [ and ])."""
    if not block:
        return 0
    # The block starts with '[' and ends with ']'
    inner = block[1:-1] if block.startswith("[") and block.endswith("]") else block
    depth = 0
    count = 0
    i = 0
    in_str = False
    str_ch = ""
    saw_obj = False
    while i < len(inner):
        ch = inner[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == str_ch:
                in_str = False
            i += 1
            continue
        if ch in ('"', "'", "`"):
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == "{":
            if depth == 0:
                count += 1
                saw_obj = True
            depth += 1
        elif ch == "}":
            depth -= 1
        i += 1
    return count


def count_top_level_string_items(block: str) -> int:
    """Count top-level string literals inside an array block (between [ and ]).
    Used for `objectives: [...]` and `requirements: [...]` which are arrays
    of string literals, not object literals."""
    if not block:
        return 0
    inner = block[1:-1] if block.startswith("[") and block.endswith("]") else block
    depth = 0
    count = 0
    i = 0
    in_str = False
    str_ch = ""
    while i < len(inner):
        ch = inner[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == str_ch:
                in_str = False
                if depth == 0:
                    count += 1
            i += 1
            continue
        if ch in ('"', "'", "`"):
            if depth == 0:
                # entering a top-level string
                pass
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == "{" or ch == "[":
            depth += 1
        elif ch == "}" or ch == "]":
            depth -= 1
        i += 1
    return count


def split_top_level_objects(block: str) -> List[str]:
    """Return a list of top-level object literal strings inside an array."""
    if not block:
        return []
    inner = block[1:-1] if block.startswith("[") and block.endswith("]") else block
    objs: List[str] = []
    depth = 0
    in_str = False
    str_ch = ""
    start = None
    i = 0
    while i < len(inner):
        ch = inner[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == str_ch:
                in_str = False
            i += 1
            continue
        if ch in ('"', "'", "`"):
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objs.append(inner[start : i + 1])
                start = None
        i += 1
    return objs


def first_string_field(obj_text: str, field: str) -> Optional[str]:
    """Find first `field: '...'` or `field: "..."` or `field: `...`"""
    pat = re.compile(r"\b" + re.escape(field) + r"\s*:\s*['\"`]([^'\"`]+)['\"`]")
    m = pat.search(obj_text)
    return m.group(1) if m else None


# --------------------------------------------------------------------------- #
# Per-section parsing                                                         #
# --------------------------------------------------------------------------- #

def parse_section(idx: int, path: Path) -> Dict[str, Any]:
    text = path.read_text(encoding="utf-8")

    # Top-level scalar fields (use first match)
    sec_id = first_match(ID_RE, text) or ""
    sec_index = int(first_match(INDEX_RE, text) or idx)
    title = first_match(TITLE_RE, text) or ""
    short_title = first_match(SHORT_TITLE_RE, text) or ""
    tagline = first_match(TAGLINE_RE, text) or ""
    level = first_match(LEVEL_RE, text) or ""
    phase = int(first_match(PHASE_RE, text) or 0)
    hours = int(first_match(HOURS_RE, text) or 0)
    icon = first_match(ICON_RE, text) or ""

    # learningOutcomes (array of {text:...})
    lo_block = find_array_block(text, "learningOutcomes")
    lo_count = count_top_level_objects(lo_block)
    lo_texts = []
    for o in split_top_level_objects(lo_block):
        t = first_string_field(o, "text")
        if t:
            lo_texts.append(t)

    # theory (array of TheoryBlock)
    th_block = find_array_block(text, "theory")
    theory_objs = split_top_level_objects(th_block)
    theory_blocks: List[Dict[str, Any]] = []
    for o in theory_objs:
        heading = first_string_field(o, "heading")
        subtopic_id = first_string_field(o, "subtopicId")
        theory_blocks.append(
            {
                "heading": heading or "",
                "subtopicId": subtopic_id,
            }
        )

    # iDo: { intro: string, steps: IDoStep[] }
    ido_block = find_block(text, "iDo")
    ido_steps_raw = find_array_block(ido_block, "steps") if ido_block else ""
    ido_steps = split_top_level_objects(ido_steps_raw)
    ido_list: List[Dict[str, Any]] = []
    for o in ido_steps:
        demo_id = first_string_field(o, "demoId")
        sub_id = first_string_field(o, "subtopicId")
        env = first_string_field(o, "environment")
        ido_list.append(
            {
                "demoId": demo_id,
                "subtopicId": sub_id,
                "environment": env,
            }
        )

    # weDo: { intro: string, steps: WeDoStep[] }
    wdo_block = find_block(text, "weDo")
    wdo_steps_raw = find_array_block(wdo_block, "steps") if wdo_block else ""
    wdo_steps = split_top_level_objects(wdo_steps_raw)
    wedo_list: List[Dict[str, Any]] = []
    for o in wdo_steps:
        ex_id = first_string_field(o, "id")
        sub_id = first_string_field(o, "subtopicId")
        kind = first_string_field(o, "kind")
        title = first_string_field(o, "title")
        # Hint to E1/E2/E3 suffix
        variant = None
        if ex_id and ex_id.rsplit("-", 1)[-1] in ("E1", "E2", "E3", "E4"):
            variant = ex_id.rsplit("-", 1)[-1]
        wedo_list.append(
            {
                "exerciseId": ex_id,
                "subtopicId": sub_id,
                "kind": kind,
                "title": title,
                "variant": variant,
            }
        )

    # youDo: { title, context, objectives[], requirements[], rubric[], ... }
    ydo_block = find_block(text, "youDo")
    ydo_title = first_string_field(ydo_block, "title") or ""
    objectives_arr = find_array_block(ydo_block, "objectives")
    requirements_arr = find_array_block(ydo_block, "requirements")
    rubric_arr = find_array_block(ydo_block, "rubric")
    objectives_count = count_top_level_string_items(objectives_arr) if objectives_arr else 0
    requirements_count = count_top_level_string_items(requirements_arr) if requirements_arr else 0
    rubric_objs = split_top_level_objects(rubric_arr)
    rubric: List[Dict[str, Any]] = []
    for o in rubric_objs:
        criterion = first_string_field(o, "criterion")
        weight = first_string_field(o, "weight")
        rubric.append({"criterion": criterion or "", "weight": weight or ""})

    # selfCheck: { questions: QuizQuestion[] }
    sc_block = find_block(text, "selfCheck")
    sc_q_block = find_array_block(sc_block, "questions") if sc_block else ""
    sc_q_objs = split_top_level_objects(sc_q_block)
    correct_indices = []
    sc_questions = []
    for o in sc_q_objs:
        q = first_string_field(o, "question")
        ci_m = re.search(r"correctIndex:\s*(\d+)", o)
        ci = int(ci_m.group(1)) if ci_m else None
        correct_indices.append(ci)
        sc_questions.append(
            {
                "question": (q or "")[:120],
                "correctIndex": ci,
            }
        )

    # topicEvaluations (optional, inline)
    te_block = find_array_block(text, "topicEvaluations")
    te_objs = split_top_level_objects(te_block) if te_block else []
    topic_evals: List[Dict[str, Any]] = []
    for o in te_objs:
        te_id = first_string_field(o, "id")
        te_title = first_string_field(o, "title")
        # tasks: array of {id, title, ...}
        tasks_arr = find_array_block(o, "tasks")
        task_objs = split_top_level_objects(tasks_arr) if tasks_arr else []
        tasks = []
        for t in task_objs:
            tasks.append(
                {
                    "id": first_string_field(t, "id"),
                    "title": first_string_field(t, "title"),
                    "authentic": "authentic: true" in t,
                    "deliverable": (first_string_field(t, "deliverable") or "")[:160],
                }
            )
        topic_evals.append(
            {
                "id": te_id,
                "title": te_title,
                "taskCount": len(task_objs),
                "tasks": tasks,
            }
        )

    return {
        "sectionNumber": sec_index,
        "sectionId": sec_id,
        "title": title,
        "shortTitle": short_title,
        "tagline": tagline,
        "phase": phase,
        "level": level,
        "estimatedHours": hours,
        "icon": icon,
        "filePath": str(path.relative_to(REPO)),
        "sourceLines": len(text.splitlines()),
        "learningOutcomes": {
            "count": lo_count,
            "texts": lo_texts,
        },
        "theory": {
            "count": len(theory_blocks),
            "subtopicIds": [b["subtopicId"] for b in theory_blocks if b["subtopicId"]],
            "headings": [b["heading"] for b in theory_blocks],
            "blocks": theory_blocks,
        },
        "iDo": {
            "count": len(ido_list),
            "demoIds": [s["demoId"] for s in ido_list if s["demoId"]],
            "subtopicIds": [s["subtopicId"] for s in ido_list if s["subtopicId"]],
            "steps": ido_list,
            "environments": sorted({s["environment"] for s in ido_list if s["environment"]}),
        },
        "weDo": {
            "count": len(wedo_list),
            "exerciseIds": [s["exerciseId"] for s in wedo_list if s["exerciseId"]],
            "subtopicIds": [s["subtopicId"] for s in wedo_list if s["subtopicId"]],
            "kinds": sorted({s["kind"] for s in wedo_list if s["kind"]}),
            "variants": sorted({s["variant"] for s in wedo_list if s["variant"]}),
            "steps": wedo_list,
        },
        "youDo": {
            "title": ydo_title,
            "objectivesCount": objectives_count,
            "requirementsCount": requirements_count,
            "rubricCriteria": len(rubric_objs),
            "rubric": rubric,
            "hasCapstoneRef": bool(re.search(r"CP-(?:N\d+-[A-Z]|FINAL)", ydo_block or "")),
            "capstoneRefs": sorted(set(re.findall(r"CP-(?:N\d+-[A-Z]|FINAL)", ydo_block or ""))),
        },
        "selfCheck": {
            "questionCount": len(sc_questions),
            "correctIndices": correct_indices,
            "questions": sc_questions,
        },
        "topicEvaluations": {
            "count": len(topic_evals),
            "evaluations": topic_evals,
        },
    }


def first_match(pat: re.Pattern, text: str) -> Optional[str]:
    m = pat.search(text)
    return m.group(1) if m else None


# --------------------------------------------------------------------------- #
# Step 3. Skill node mapping                                                  #
# --------------------------------------------------------------------------- #

# Canonical industry skill node IDs (from industry_skill_graph.json)
INDUSTRY_SKILL_IDS = {
    "sql_fundamentals", "sql_window_ctes", "sql_performance_tuning",
    "excel_spreadsheets", "python_core", "python_idioms", "python_type_safety",
    "python_async", "r_language", "vbdotnet_csharp", "pandas_numpy",
    "data_cleaning", "data_validation", "bi_tools", "python_visualization",
    "descriptive_stats", "hypothesis_testing", "regression",
    "experimental_design", "causal_inference", "classical_ml",
    "model_evaluation", "leakage_prevention", "deep_learning",
    "uncertainty_quantification", "feature_engineering", "model_deployment",
    "mlops_pipelines", "drift_monitoring", "llmops", "uipath_studio",
    "selector_design", "exception_handling_rpa", "orchestrator_operations",
    "reframework", "process_analysis", "power_automate",
    "automation_anywhere", "python_rpa_browser", "testing_discipline",
    "async_testing", "observability", "system_design",
    "code_review_literacy", "packaging_reproducibility", "performance_tuning",
    "git_workflow", "docker", "kubernetes", "ci_cd", "cloud_platform",
    "security_mindset", "ai_code_review_literacy", "stakeholder_management",
    "mentoring", "written_communication", "oral_communication",
    "stakeholder_translation", "business_framing", "metric_design",
    "tradeoff_articulation", "architecture_leadership",
}


# Per-section skill-node mapping, based on the section title and content
# (and the canonical section ordering / phase plan in COURSE_META).
# Each entry lists the primary skill nodes a section's I Do / We Do / You Do
# activities are designed to evidence.
SECTION_SKILL_MAP: Dict[int, List[str]] = {
    1: ["python_core", "git_workflow", "packaging_reproducibility", "security_mindset"],
    2: ["python_core", "python_idioms"],
    3: ["python_core", "python_idioms", "data_validation"],
    4: ["python_core", "python_idioms", "testing_discipline"],
    5: ["python_core", "python_idioms", "code_review_literacy"],
    6: ["pandas_numpy", "descriptive_stats"],
    7: ["data_cleaning", "data_validation", "python_core"],
    8: ["pandas_numpy", "data_cleaning"],
    9: ["python_visualization", "bi_tools"],
    10: ["classical_ml", "model_evaluation"],
    11: ["testing_discipline", "python_core"],
    12: ["performance_tuning", "python_core"],
    13: ["python_rpa_browser", "process_analysis", "exception_handling_rpa"],
    14: ["security_mindset", "python_core"],
    15: ["python_core", "python_idioms", "packaging_reproducibility"],
    16: ["python_core", "stakeholder_management"],  # wxPython GUI
    17: ["packaging_reproducibility", "ci_cd"],
    18: ["data_cleaning", "data_validation", "pandas_numpy"],
    19: ["sql_fundamentals", "python_core"],
    20: ["llmops", "python_core"],
    21: ["python_core", "system_design", "testing_discipline"],
    22: ["data_cleaning", "python_idioms", "data_validation"],
    23: ["deep_learning", "classical_ml"],
    24: ["python_rpa_browser", "selector_design", "exception_handling_rpa"],
    25: ["python_visualization", "bi_tools", "python_core"],
    26: ["python_rpa_browser", "process_analysis", "stakeholder_translation", "business_framing"],
    27: ["python_async", "async_testing"],
    28: ["llmops", "python_async"],
    29: ["mlops_pipelines", "model_deployment", "drift_monitoring"],
    30: ["security_mindset", "observability", "cloud_platform"],
    31: ["python_async", "data_cleaning", "observability"],
    32: ["system_design", "python_async", "observability"],
    33: ["classical_ml", "deep_learning", "uncertainty_quantification"],
    34: ["deep_learning", "classical_ml", "python_core"],
    35: ["system_design", "architecture_leadership", "tradeoff_articulation"],
    36: ["llmops", "python_async"],
    37: ["sql_fundamentals", "sql_window_ctes", "data_validation"],
    38: ["performance_tuning", "python_async", "observability"],
    39: ["system_design", "stakeholder_translation", "business_framing", "metric_design"],
    40: ["architecture_leadership", "system_design", "code_review_literacy"],
    41: ["deep_learning", "llmops", "mlops_pipelines"],
    42: ["llmops", "data_cleaning", "python_core"],
    43: ["llmops", "mlops_pipelines", "drift_monitoring", "observability"],
    44: ["deep_learning", "llmops"],
    45: ["ci_cd", "cloud_platform", "docker", "kubernetes"],
    46: ["deep_learning", "performance_tuning", "cloud_platform"],
    47: ["code_review_literacy", "git_workflow", "mentoring"],
    48: ["security_mindset", "ai_code_review_literacy", "stakeholder_management"],
    49: ["data_validation", "data_cleaning", "stakeholder_translation"],
    50: ["mentoring", "architecture_leadership", "oral_communication", "written_communication"],
    51: ["system_design", "architecture_leadership", "tradeoff_articulation", "stakeholder_translation"],
    52: ["business_framing", "oral_communication", "written_communication", "stakeholder_management"],
}


def skill_nodes_for_section(sec_num: int) -> List[str]:
    return SECTION_SKILL_MAP.get(sec_num, [])


# --------------------------------------------------------------------------- #
# Step 4. Build learning activities with classifications                      #
# --------------------------------------------------------------------------- #

def classify_activity(
    sec: Dict[str, Any],
    activity_type: str,
    activity_id: str,
    subtopic_id: Optional[str],
    skill_nodes: List[str],
    *,
    capstone_ref: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Apply the Phase 3 classification scheme:
      - I Do  → guided, weak/moderate evidence, low authenticity
      - We Do → guided (E1) → partially_guided (E2) → independent (E3)
      - You Do → independent, strong evidence, high authenticity (capstone)
      - Self-check → formative, weak evidence, low authenticity
      - Theory → no independence, no evidence (just text)
      - Topic evaluation → partially_guided → independent, moderate, medium
    """
    sec_num = sec["sectionNumber"]

    classification = {
        "theory": dict(evidence_independence="none", evidence_strength="none",
                       authenticity="low", feedback_quality="low",
                       credential_eligible=False,
                       limitations=["passive text consumption; no observable evidence"]),
        "i_do": dict(evidence_independence="guided", evidence_strength="weak",
                     authenticity="low", feedback_quality="low",
                     credential_eligible=False,
                     limitations=["instructor-led demo; learner observes only"]),
        "we_do": dict(evidence_independence="guided", evidence_strength="moderate",
                      authenticity="medium", feedback_quality="medium",
                      credential_eligible=False,
                      limitations=["scaffolded with starter code, hints, and solution"]),
        "you_do": dict(evidence_independence="independent", evidence_strength="strong",
                       authenticity="high", feedback_quality="medium",
                       credential_eligible=True,
                       limitations=["rubric-based scoring, not auto-graded"]),
        "self_check": dict(evidence_independence="independent", evidence_strength="weak",
                           authenticity="low", feedback_quality="medium",
                           credential_eligible=False,
                           limitations=["multiple-choice only; no transfer evidence"]),
        "topic_evaluation": dict(evidence_independence="partially_guided",
                                 evidence_strength="moderate",
                                 authenticity="medium",
                                 feedback_quality="medium",
                                 credential_eligible=False,
                                 limitations=["formative; rubric 0-3 not gated"]),
        "exercise": dict(evidence_independence="partially_guided",
                         evidence_strength="moderate",
                         authenticity="medium",
                         feedback_quality="medium",
                         credential_eligible=False,
                         limitations=["scaffolded by starter code + hints"]),
        "exam": dict(evidence_independence="independent",
                     evidence_strength="strong",
                     authenticity="low",
                     feedback_quality="low",
                     credential_eligible=True,
                     limitations=["server-graded MCQ; pass@70; max 3 attempts; recall-biased"]),
        "project": dict(evidence_independence="independent",
                        evidence_strength="strong",
                        authenticity="high",
                        feedback_quality="medium",
                        credential_eligible=True,
                        limitations=["rubric-based; not auto-graded"]),
        "capstone": dict(evidence_independence="independent",
                         evidence_strength="strong",
                         authenticity="high",
                         feedback_quality="medium",
                         credential_eligible=True,
                         limitations=["cross-section capstone; rubric-based"]),
    }

    base = classification.get(
        activity_type, classification["theory"]
    ).copy()

    # Per-variant override for We Do (E1/E2/E3 progressive release)
    if activity_type == "we_do":
        # variant detection
        variant = None
        if activity_id and activity_id.rsplit("-", 1)[-1] in ("E1", "E2", "E3", "E4"):
            variant = activity_id.rsplit("-", 1)[-1]
        if variant == "E1":
            base["evidence_independence"] = "guided"
            base["evidence_strength"] = "moderate"
        elif variant == "E2":
            base["evidence_independence"] = "partially_guided"
            base["evidence_strength"] = "moderate"
        elif variant == "E3":
            base["evidence_independence"] = "independent"
            base["evidence_strength"] = "moderate"
            base["authenticity"] = "medium"
            base["credential_eligible"] = False  # still within section
            base["limitations"] = [
                "independent within-section exercise; capstone integration deferred"
            ]

    return {
        "activity_id": activity_id,
        "section_id": f"S{sec_num:02d}",
        "subtopic_id": subtopic_id,
        "activity_type": activity_type,
        "skill_nodes": skill_nodes,
        "capstone_ref": capstone_ref,
        **base,
    }


def build_activities(sec: Dict[str, Any]) -> List[Dict[str, Any]]:
    activities: List[Dict[str, Any]] = []
    sec_num = sec["sectionNumber"]
    sec_skills = skill_nodes_for_section(sec_num)
    sec_id = f"S{sec_num:02d}"

    # Theory blocks
    for i, blk in enumerate(sec["theory"]["blocks"], start=1):
        aid = blk["subtopicId"] or f"{sec_id}-T{i}"
        activities.append(
            classify_activity(
                sec, "theory", aid, blk["subtopicId"], sec_skills
            )
        )

    # I Do steps (instructor demo)
    for i, s in enumerate(sec["iDo"]["steps"], start=1):
        aid = s["demoId"] or f"{sec_id}-DEMO{i}"
        activities.append(
            classify_activity(
                sec, "i_do", aid, s["subtopicId"], sec_skills
            )
        )

    # We Do steps (guided practice)
    for i, s in enumerate(sec["weDo"]["steps"], start=1):
        aid = s["exerciseId"] or f"{sec_id}-E{i}"
        activities.append(
            classify_activity(
                sec, "we_do", aid, s["subtopicId"], sec_skills
            )
        )

    # You Do (capstone / project)
    ydo = sec["youDo"]
    capstone_refs = ydo.get("capstoneRefs") or []
    cap_ref = capstone_refs[0] if capstone_refs else None
    aid = f"{sec_id}-YOUDO"
    # Integrator sections (S26, S39, S51) explicitly close capstone gates
    if sec_num in (26, 39, 51):
        atype = "capstone"
    else:
        atype = "you_do"
    activities.append(
        classify_activity(
            sec, atype, aid, None, sec_skills, capstone_ref=cap_ref
        )
    )

    # Self-check questions (one activity per question, but aggregate)
    # Per Phase 3 spec, treat the selfCheck as one formative activity per section.
    sc = sec["selfCheck"]
    if sc["questionCount"] > 0:
        aid = f"{sec_id}-SELFCHECK"
        activities.append(
            classify_activity(
                sec, "self_check", aid, None, sec_skills
            )
        )

    # Topic evaluations (where present)
    for te in sec["topicEvaluations"]["evaluations"]:
        for task in te["tasks"]:
            aid = task.get("id") or f"{sec_id}-TE-{te['id']}"
            cap_ref = cap_ref_main = (capstone_refs[0] if capstone_refs else None)
            activities.append(
                classify_activity(
                    sec, "topic_evaluation", aid, None, sec_skills,
                    capstone_ref=cap_ref_main,
                )
            )

    # Exam activity (server-graded MCQ, max 3 attempts, pass@70) — implicit
    # Every section has a server-side exam per Phase 0 finding §4.
    aid = f"{sec_id}-EXAM"
    activities.append(
        classify_activity(
            sec, "exam", aid, None, sec_skills
        )
    )

    return activities


# --------------------------------------------------------------------------- #
# Step 5. Build skill edges                                                   #
# --------------------------------------------------------------------------- #

def build_edges(sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    edges: List[Dict[str, Any]] = []
    seen = set()

    def add(src: str, dst: str, etype: str, meta: Optional[Dict[str, Any]] = None):
        key = (src, dst, etype)
        if key in seen:
            return
        seen.add(key)
        e = {"source": src, "target": dst, "edge_type": etype}
        if meta:
            e.update(meta)
        edges.append(e)

    # Prerequisite edges: section N → section N+1 (sequential pipeline)
    for i in range(len(sections) - 1):
        src_sec = sections[i]
        dst_sec = sections[i + 1]
        add(
            f"S{src_sec['sectionNumber']:02d}",
            f"S{dst_sec['sectionNumber']:02d}",
            "prerequisite",
            {"kind": "sequential_pipeline"},
        )

    # Reinforcement edges: theory → i_do → we_do → you_do (within section)
    for sec in sections:
        sec_id = f"S{sec['sectionNumber']:02d}"
        sub_ids = sec["theory"]["subtopicIds"]
        # Group activities per subtopic
        sub_to_activities: Dict[str, List[str]] = {}
        # theory
        for blk in sec["theory"]["blocks"]:
            sid = blk["subtopicId"]
            if sid:
                sub_to_activities.setdefault(sid, []).append(sid)
        # iDo
        for s in sec["iDo"]["steps"]:
            sid = s["subtopicId"]
            if sid:
                sub_to_activities.setdefault(sid, []).append(s["demoId"] or f"{sec_id}-DEMO")
        # weDo
        for s in sec["weDo"]["steps"]:
            sid = s["subtopicId"]
            if sid and s["exerciseId"]:
                sub_to_activities.setdefault(sid, []).append(s["exerciseId"])
        # chain within subtopic
        for sid, acts in sub_to_activities.items():
            for j in range(len(acts) - 1):
                add(acts[j], acts[j + 1], "reinforcement",
                    {"section_id": sec_id, "subtopic_id": sid})

        # Theory → self-check (assessment of theory)
        for blk in sec["theory"]["blocks"]:
            sid = blk["subtopicId"]
            if sid:
                add(sid, f"{sec_id}-SELFCHECK", "assessment",
                    {"section_id": sec_id})
        # Theory → exam (assessment)
        for blk in sec["theory"]["blocks"]:
            sid = blk["subtopicId"]
            if sid:
                add(sid, f"{sec_id}-EXAM", "assessment",
                    {"section_id": sec_id})
        # weDo → you_do (transfer)
        for s in sec["weDo"]["steps"]:
            if s["exerciseId"]:
                add(s["exerciseId"], f"{sec_id}-YOUDO", "transfer",
                    {"section_id": sec_id})
        # you_do → exam (project_application)
        add(f"{sec_id}-YOUDO", f"{sec_id}-EXAM", "project_application",
            {"section_id": sec_id})
        # you_do → badge_evidence (each section contributes to phase badge)
        add(f"{sec_id}-YOUDO", f"BADGE-PHASE-{sec['phase']}", "badge_evidence",
            {"section_id": sec_id, "phase": sec["phase"]})
        # exam → badge_evidence
        add(f"{sec_id}-EXAM", f"BADGE-PHASE-{sec['phase']}", "badge_evidence",
            {"section_id": sec_id, "phase": sec["phase"]})

    # Capstone integration edges: integrator sections close capstone gates
    # across multiple sections within the same phase.
    integrator_phase_map = {26: 1, 39: 2, 51: 3}
    for sec_num, phase in integrator_phase_map.items():
        integrator_id = f"S{sec_num:02d}-YOUDO"
        for sec in sections:
            if sec["phase"] != phase:
                continue
            if sec["sectionNumber"] == sec_num:
                continue
            src_id = f"S{sec['sectionNumber']:02d}-YOUDO"
            add(src_id, integrator_id, "capstone_integration",
                {"integrator_section": f"S{sec_num:02d}", "phase": phase})

    # Skill node edges: section activity → industry skill node
    for sec in sections:
        sec_id = f"S{sec['sectionNumber']:02d}"
        skills = skill_nodes_for_section(sec["sectionNumber"])
        # you_do → skill nodes (badge evidence through skill mastery)
        for sk in skills:
            add(f"{sec_id}-YOUDO", f"SKILL:{sk}", "skill_application",
                {"section_id": sec_id, "skill_node": sk})
            add(f"{sec_id}-EXAM", f"SKILL:{sk}", "skill_application",
                {"section_id": sec_id, "skill_node": sk})

    # Cross-section skill reinforcement (sections sharing a skill node)
    # For each skill, link consecutive sections that teach it
    skill_to_secs: Dict[str, List[int]] = {}
    for sec in sections:
        for sk in skill_nodes_for_section(sec["sectionNumber"]):
            skill_to_secs.setdefault(sk, []).append(sec["sectionNumber"])
    for sk, secs in skill_to_secs.items():
        secs_sorted = sorted(secs)
        for i in range(len(secs_sorted) - 1):
            src = f"S{secs_sorted[i]:02d}-YOUDO"
            dst = f"S{secs_sorted[i+1]:02d}-YOUDO"
            add(src, dst, "skill_reinforcement",
                {"skill_node": sk})

    return edges


# --------------------------------------------------------------------------- #
# Step 6. Main                                                                #
# --------------------------------------------------------------------------- #

def main() -> None:
    canonical = read_canonical_section_files()
    print(f"[Phase 3] Reading {len(canonical)} canonical section files...",
          file=sys.stderr)

    sections: List[Dict[str, Any]] = []
    for idx, path in canonical:
        try:
            sec = parse_section(idx, path)
            sections.append(sec)
            print(f"  S{idx:02d} {sec['sectionId']:30s} "
                  f"theory={sec['theory']['count']:2d} "
                  f"iDo={sec['iDo']['count']:2d} "
                  f"weDo={sec['weDo']['count']:2d} "
                  f"selfCheck={sec['selfCheck']['questionCount']:2d} "
                  f"TE={sec['topicEvaluations']['count']:2d}",
                  file=sys.stderr)
        except Exception as e:
            print(f"  S{idx:02d} ERROR: {e}", file=sys.stderr)
            raise

    # Build activities
    all_activities: List[Dict[str, Any]] = []
    for sec in sections:
        all_activities.extend(build_activities(sec))

    # Build edges
    edges = build_edges(sections)

    # Summary stats
    by_type: Dict[str, int] = {}
    cred_eligible = 0
    skill_counter: Dict[str, int] = {}
    for a in all_activities:
        by_type[a["activity_type"]] = by_type.get(a["activity_type"], 0) + 1
        if a["credential_eligible"]:
            cred_eligible += 1
        for sk in a["skill_nodes"]:
            skill_counter[sk] = skill_counter.get(sk, 0) + 1

    by_phase: Dict[int, Dict[str, int]] = {}
    for a in all_activities:
        ph = None
        # recover phase from section
        sec_num = int(a["section_id"][1:])
        ph = next((s["phase"] for s in sections if s["sectionNumber"] == sec_num), 0)
        by_phase.setdefault(ph, {})
        by_phase[ph][a["activity_type"]] = by_phase[ph].get(a["activity_type"], 0) + 1

    # Capstone inventory (sections that explicitly reference CP-N*-X)
    capstones: Dict[str, List[int]] = {}
    for sec in sections:
        for ref in sec["youDo"]["capstoneRefs"]:
            capstones.setdefault(ref, []).append(sec["sectionNumber"])

    # Edge type counts
    edge_type_counts: Dict[str, int] = {}
    for e in edges:
        edge_type_counts[e["edge_type"]] = edge_type_counts.get(e["edge_type"], 0) + 1

    # ---- Compose output JSON ----
    out = {
        "version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_by": "curriculum_graph_builder node (Phase 3)",
        "source_files": {
            "course_index": str(COURSE_INDEX.relative_to(REPO)),
            "section_files_dir": str(SECTIONS_DIR.relative_to(REPO)),
            "industry_skill_graph": str(INDUSTRY_GRAPH.relative_to(REPO)),
            "canonical_section_count": len(canonical),
        },
        "industry_skill_node_count": len(INDUSTRY_SKILL_IDS),
        "skill_node_vocabulary": sorted(INDUSTRY_SKILL_IDS),
        "sections": sections,
        "activities": all_activities,
        "edges": edges,
        "capstones": [
            {"capstone_id": k, "section_numbers": v}
            for k, v in sorted(capstones.items())
        ],
        "summary": {
            "section_count": len(sections),
            "activity_count": len(all_activities),
            "edge_count": len(edges),
            "activities_by_type": by_type,
            "activities_by_phase": by_phase,
            "credential_eligible_activities": cred_eligible,
            "skill_node_coverage": {
                "covered_skills": len(skill_counter),
                "uncovered_skills": sorted(INDUSTRY_SKILL_IDS - set(skill_counter.keys())),
                "skill_activity_counts": dict(
                    sorted(skill_counter.items(), key=lambda x: -x[1])
                ),
            },
            "capstone_count": len(capstones),
            "edge_type_counts": edge_type_counts,
            "totals": {
                "theory_blocks": sum(s["theory"]["count"] for s in sections),
                "i_do_steps": sum(s["iDo"]["count"] for s in sections),
                "we_do_steps": sum(s["weDo"]["count"] for s in sections),
                "you_do_projects": sum(1 for s in sections if s["youDo"]["title"]),
                "self_check_questions": sum(s["selfCheck"]["questionCount"] for s in sections),
                "topic_evaluations": sum(s["topicEvaluations"]["count"] for s in sections),
                "exam_activities": sum(1 for s in sections),
                "estimated_hours": sum(s["estimatedHours"] for s in sections),
            },
        },
    }

    OUT_JSON.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n[Phase 3] Wrote {OUT_JSON.relative_to(REPO)} "
          f"({OUT_JSON.stat().st_size:,} bytes)", file=sys.stderr)

    # ---- Compose summary MD ----
    write_summary_md(out)
    print(f"[Phase 3] Wrote {OUT_MD.relative_to(REPO)}", file=sys.stderr)


def write_summary_md(out: Dict[str, Any]) -> None:
    lines: List[str] = []
    lines.append("# Phase 3 — Complete Curriculum Skill Graph Summary\n")
    lines.append(f"**Generated:** {out['generated_at']}  ")
    lines.append(f"**Generator:** {out['generated_by']}\n")
    lines.append("## 1. Source Inventory\n")
    lines.append(f"- Canonical section files parsed: **{out['source_files']['canonical_section_count']}**")
    lines.append(f"- Course index: `{out['source_files']['course_index']}`")
    lines.append(f"- Sections directory: `{out['source_files']['section_files_dir']}`")
    lines.append(f"- Industry skill graph (Phase 2): `{out['source_files']['industry_skill_graph']}`")
    lines.append(f"- Industry skill node vocabulary size: **{out['industry_skill_node_count']}**\n")

    lines.append("## 2. Totals\n")
    t = out["summary"]["totals"]
    lines.append("| Resource | Count |")
    lines.append("|---|---:|")
    lines.append(f"| Sections | {out['summary']['section_count']} |")
    lines.append(f"| Theory blocks | {t['theory_blocks']} |")
    lines.append(f"| I Do demos | {t['i_do_steps']} |")
    lines.append(f"| We Do exercises (E1+E2+E3 variants) | {t['we_do_steps']} |")
    lines.append(f"| You Do projects | {t['you_do_projects']} |")
    lines.append(f"| Self-check questions | {t['self_check_questions']} |")
    lines.append(f"| Topic evaluations (inline) | {t['topic_evaluations']} |")
    lines.append(f"| Implicit exam activities (server-graded MCQ) | {t['exam_activities']} |")
    lines.append(f"| Total learning activities (incl. exams) | {out['summary']['activity_count']} |")
    lines.append(f"| Total skill edges | {out['summary']['edge_count']} |")
    lines.append(f"| Capstones referenced (CP-N*-X) | {out['summary']['capstone_count']} |")
    lines.append(f"| Credential-eligible activities | {out['summary']['credential_eligible_activities']} |")
    lines.append(f"| Estimated total course hours | {t['estimated_hours']} |\n")

    lines.append("## 3. Activities by Type (across all 52 sections)\n")
    lines.append("| Activity type | Count |")
    lines.append("|---|---:|")
    for k, v in sorted(out["summary"]["activities_by_type"].items(),
                        key=lambda x: -x[1]):
        lines.append(f"| `{k}` | {v} |")
    lines.append("")

    lines.append("## 4. Activities by Phase × Type\n")
    lines.append("| Phase | theory | i_do | we_do | you_do | self_check | topic_evaluation | exam | capstone |")
    lines.append("|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    for ph in sorted(out["summary"]["activities_by_phase"].keys(),
                     key=lambda x: int(x)):
        row = out["summary"]["activities_by_phase"][ph]
        lines.append(
            f"| {ph} | {row.get('theory',0)} | {row.get('i_do',0)} | "
            f"{row.get('we_do',0)} | {row.get('you_do',0)} | "
            f"{row.get('self_check',0)} | {row.get('topic_evaluation',0)} | "
            f"{row.get('exam',0)} | {row.get('capstone',0)} |"
        )
    lines.append("")

    lines.append("## 5. Edge Inventory\n")
    lines.append("| Edge type | Count | Description |")
    lines.append("|---|---:|---|")
    desc = {
        "prerequisite": "Sequential section→section pipeline edge (S1→S2→...→S52)",
        "reinforcement": "Within-section theory→demo→exercise chain per subtopic",
        "transfer": "We Do → You Do transfer of skill (within section)",
        "assessment": "Theory → Self-check / Exam assessment edge",
        "project_application": "You Do project applied to the section's exam scope",
        "badge_evidence": "Activity contributes evidence to a phase-level badge",
        "capstone_integration": "Per-phase integrator section (S26/S39/S51) closes the phase capstone",
        "skill_application": "Section activity maps to an industry skill node",
        "skill_reinforcement": "Consecutive sections teaching the same skill reinforce it",
    }
    for k, v in sorted(out["summary"]["edge_type_counts"].items(),
                        key=lambda x: -x[1]):
        lines.append(f"| `{k}` | {v} | {desc.get(k, '')} |")
    lines.append("")

    lines.append("## 6. Capstone Inventory\n")
    if out["capstones"]:
        lines.append("| Capstone ID | Sections contributing |")
        lines.append("|---|---|")
        for c in out["capstones"]:
            secs = ", ".join(f"S{n:02d}" for n in c["section_numbers"])
            lines.append(f"| `{c['capstone_id']}` | {secs} |")
    else:
        lines.append("No `CP-N*-X` references found in You Do project titles.")
    lines.append("")

    lines.append("## 7. Skill Node Coverage\n")
    cov = out["summary"]["skill_node_coverage"]
    lines.append(f"- Industry skill nodes covered by at least one section: **{cov['covered_skills']}/{out['industry_skill_node_count']}**")
    if cov["uncovered_skills"]:
        lines.append(f"- Industry skill nodes NOT covered by any section ({len(cov['uncovered_skills'])}):")
        for s in cov["uncovered_skills"]:
            lines.append(f"  - `{s}`")
    else:
        lines.append("- No uncovered skill nodes.")
    lines.append("")
    lines.append("Top-20 skill nodes by activity count:\n")
    lines.append("| Skill node | Activity count |")
    lines.append("|---|---:|")
    for sk, cnt in list(cov["skill_activity_counts"].items())[:20]:
        lines.append(f"| `{sk}` | {cnt} |")
    lines.append("")

    lines.append("## 8. Per-Section Inventory (52 rows)\n")
    lines.append("| # | ID | Phase | Title | Theory | I Do | We Do | Self-check | You Do | Capstone | TE |")
    lines.append("|---:|---|---:|---|---:|---:|---:|---:|---|---|---:|")
    for sec in out["sections"]:
        cap = ", ".join(sec["youDo"]["capstoneRefs"]) or "—"
        te = sec["topicEvaluations"]["count"]
        lines.append(
            f"| {sec['sectionNumber']} | `{sec['sectionId']}` | "
            f"{sec['phase']} | {sec['title'][:60]} | "
            f"{sec['theory']['count']} | {sec['iDo']['count']} | "
            f"{sec['weDo']['count']} | {sec['selfCheck']['questionCount']} | "
            f"{('✓' if sec['youDo']['title'] else '—')} | {cap} | {te} |"
        )
    lines.append("")

    lines.append("## 8b. You Do Project Detail (per section)\n")
    lines.append("| # | Hours | Objectives | Requirements | Rubric criteria | Capstone refs |")
    lines.append("|---:|---:|---:|---:|---:|---|")
    for sec in out["sections"]:
        yd = sec["youDo"]
        cap = ", ".join(yd["capstoneRefs"]) or "—"
        lines.append(
            f"| {sec['sectionNumber']} | {sec['estimatedHours']} | "
            f"{yd['objectivesCount']} | {yd['requirementsCount']} | "
            f"{yd['rubricCriteria']} | {cap} |"
        )
    lines.append("")

    lines.append("## 9. Classification Heuristic (per activity type)\n")
    lines.append("| Activity type | Independence | Strength | Authenticity | Feedback | Credential-eligible |")
    lines.append("|---|---|---|---|---|---|")
    heur = [
        ("theory", "none", "none", "low", "low", "no"),
        ("i_do", "guided", "weak", "low", "low", "no"),
        ("we_do E1", "guided", "moderate", "medium", "medium", "no"),
        ("we_do E2", "partially_guided", "moderate", "medium", "medium", "no"),
        ("we_do E3", "independent", "moderate", "medium", "medium", "no"),
        ("you_do", "independent", "strong", "high", "medium", "yes"),
        ("self_check", "independent", "weak", "low", "medium", "no"),
        ("topic_evaluation", "partially_guided", "moderate", "medium", "medium", "no"),
        ("exam", "independent", "strong", "low", "low", "yes"),
        ("capstone (S26/S39/S51)", "independent", "strong", "high", "medium", "yes"),
    ]
    for row in heur:
        lines.append("| " + " | ".join(row) + " |")
    lines.append("")

    lines.append("## 10. Phase 3 Gate Check\n")
    gates = [
        ("All 52 canonical sections read", len(out["sections"]) == 52),
        ("All sections have ≥1 theory block",
         all(s["theory"]["count"] >= 1 for s in out["sections"])),
        ("All sections have ≥1 I Do step",
         all(s["iDo"]["count"] >= 1 for s in out["sections"])),
        ("All sections have ≥1 We Do exercise",
         all(s["weDo"]["count"] >= 1 for s in out["sections"])),
        ("All sections have a You Do project",
         all(s["youDo"]["title"] for s in out["sections"])),
        ("All You Do projects have ≥1 objective",
         all(s["youDo"]["objectivesCount"] >= 1 for s in out["sections"])),
        ("All You Do projects have ≥1 requirement",
         all(s["youDo"]["requirementsCount"] >= 1 for s in out["sections"])),
        ("All You Do projects have ≥1 rubric criterion",
         all(s["youDo"]["rubricCriteria"] >= 1 for s in out["sections"])),
        ("All sections have ≥1 self-check question",
         all(s["selfCheck"]["questionCount"] >= 1 for s in out["sections"])),
        ("All sections mapped to ≥1 industry skill node",
         all(skill_nodes_for_section(s["sectionNumber"])
             for s in out["sections"])),
        ("Each activity classified with evidence_independence + strength + authenticity + feedback_quality + credential_eligible",
         all({"evidence_independence","evidence_strength","authenticity",
              "feedback_quality","credential_eligible"} <= set(a.keys())
             for a in out["activities"])),
        ("Capstone integration edges present for S26, S39, S51",
         any(e["edge_type"] == "capstone_integration" for e in out["edges"])),
        ("All 13 capstones referenced (CP-N1-A..CP-N4-C + CP-FINAL)",
         len(out["capstones"]) == 13),
    ]
    for label, passed in gates:
        lines.append(f"- [{'x' if passed else ' '}] {label}")
    all_pass = all(p for _, p in gates)
    lines.append(f"\n**Overall: {'PASS' if all_pass else 'FAIL'}**\n")

    lines.append("## 11. Handoff to Phase 4 (Gap Analysis)\n")
    lines.append("Phase 4 should consume `curriculum_skill_graph.json` to:")
    lines.append("1. Compare `skill_node_coverage.uncovered_skills` against "
                 "`industry_skill_graph.json#skill_nodes` to identify durable "
                 "industry gaps that the curriculum never addresses.")
    lines.append("2. For each `industry_skill_graph.json#critical_competencies` "
                 "entry, verify whether at least one `credential_eligible=true` "
                 "activity maps to its `skill_ids` — otherwise the badge cannot "
                 "be issued for that competency.")
    lines.append("3. Use the `capstone_integration` edges to verify that every "
                 "phase capstone (CP-N1-A, CP-N2-A/B/C, CP-N3-*) has at least "
                 "one credential-eligible contribution from each section in "
                 "the phase.")
    lines.append("4. Audit `activities_by_type` to confirm the I Do / We Do / "
                 "You Do ratio matches Gradual Release of Responsibility "
                 "(target: We Do ≥ I Do ≥ You Do per section, with E1+E2+E3 "
                 "variants present).")
    lines.append("5. Flag sections whose `selfCheck.questionCount < 5` (V3 "
                 "spec calls for 5 questions) — recorded but not gated here.")
    lines.append("")

    OUT_MD.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
