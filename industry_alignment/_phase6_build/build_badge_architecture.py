#!/usr/bin/env python3
"""
Phase 6 — Badge and Credential Architecture generator.

Produces:
  - badge_catalog.json            (all badge specifications)
  - badge_dependency_graph.json   (prerequisite edges)
  - badge_claim_register.md       (claims + non-claims register)
  - badge_requirements/<id>.md    (per-badge detailed requirements)
  - badge_rubrics/<id>.json       (per-badge scoring rubrics)
  - eligibility_state_machine.md  (state machine spec)
  - credential_architecture.md    (architecture document)
  - progress_migration_plan.md    (legacy-progress migration)

Design constraints honored:
  - Never exceed evidence collected from each learner.
  - No occupational seniority implied.
  - Local achievements vs. verified credentials distinguished.
  - Independent evidence required (not just guided completion).
  - Non-compensatory critical competencies.
  - Conservative provisional floors: self_check >=85%, you_do >=80%,
    project rubric >=85%, critical competency =100%.
  - Legacy course completion does NOT fabricate missing badge evidence.
  - Stephen Fry redaction: newbie-friendly descriptions with inline jargon
    explanations on every learner-facing badge description.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from textwrap import dedent

BASE = Path(__file__).resolve().parents[1]
REQ_DIR = BASE / "badge_requirements"
RUB_DIR = BASE / "badge_rubrics"
REQ_DIR.mkdir(parents=True, exist_ok=True)
RUB_DIR.mkdir(parents=True, exist_ok=True)

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
ISSUER = "PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)"
CATALOG_VERSION = "1.0.0"

# ---------------------------------------------------------------------------
# Shared building blocks
# ---------------------------------------------------------------------------

PROVISIONAL_FLOORS = {
    "self_check_pct": 85,
    "you_do_pct": 80,
    "section_exam_pct": 85,
    "integrator_project_pct": 85,
    "critical_competency_pct": 100,
    "minimum_overall_pct": 85,
}

# ---------------------------------------------------------------------------
# Badge family 1 — Progress achievements (local_achievement)
# ---------------------------------------------------------------------------

PROGRESS_BADGES = [
    {
        "badge_id": "progress_phase0_walked",
        "name": "Phase 0 — Foundations Walked",
        "public_claim": (
            "The learner has completed all 13 sections of PyArcana Phase 0 "
            "(Foundations): S01 through S13, including the You Do project "
            "and self-check for each section."
        ),
        "non_claims": [
            "This is a motivational marker. It is NOT proof of proficiency.",
            "It does not certify any industry role, level, or job-readiness.",
            "It does not require independent (un-guided) exercise performance "
            "above the section-level self-check floor.",
            "Section completion alone does not satisfy any applied-skill, "
            "cross-section, or capstone credential requirement.",
        ],
        "credential_type": "local_achievement",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "foundation",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "pandas_numpy", "data_cleaning",
            "data_validation", "descriptive_stats", "classical_ml",
            "model_evaluation", "python_visualization", "bi_tools",
            "testing_discipline", "performance_tuning", "python_rpa_browser",
            "process_analysis", "exception_handling_rpa", "code_review_literacy",
            "security_mindset",
        ],
        "prerequisite_badges": [],
        "required_sections": [f"S{n:02d}" for n in range(1, 14)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(1, 14)]
                              + [f"S{n:02d}-EXAM" for n in range(1, 14)],
        "required_projects": [],
        "critical_competencies": [],
        "verification_mode": "local_only",
        "status": "active",
        "newbie_friendly_description": (
            "You finished the first 13 sections of PyArcana, the 'Foundations' "
            "phase. Each section ends with a You Do project (an exercise you do "
            "alone, without step-by-step help) and a short self-check quiz. "
            "Earning this marker means you walked through every section, "
            "submitted every You Do, and answered every self-check. It does NOT "
            "mean a hiring manager should treat you as a Data Analyst, Data "
            "Scientist, or any other role yet — it just means you did the work "
            "of walking through Phase 0."
        ),
    },
    {
        "badge_id": "progress_phase1_walked",
        "name": "Phase 1 — Independent Walked",
        "public_claim": (
            "The learner has completed all 13 sections of PyArcana Phase 1 "
            "(Independent Practitioner): S14 through S26, including the You Do "
            "project, self-check, and section exam for each section."
        ),
        "non_claims": [
            "Motivational marker only; NOT proof of independent proficiency.",
            "Does not certify any role or seniority.",
            "Does not by itself satisfy any cross-section or capstone credential.",
        ],
        "credential_type": "local_achievement",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "security_mindset", "python_core", "python_idioms",
            "packaging_reproducibility", "stakeholder_management", "ci_cd",
            "data_cleaning", "data_validation", "pandas_numpy",
            "sql_fundamentals", "llmops", "system_design", "testing_discipline",
            "deep_learning", "classical_ml",
            "python_rpa_browser", "selector_design", "exception_handling_rpa",
            "python_visualization", "bi_tools", "business_framing",
            "process_analysis", "stakeholder_translation",
        ],
        "prerequisite_badges": ["progress_phase0_walked"],
        "required_sections": [f"S{n:02d}" for n in range(14, 27)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(14, 27)]
                              + [f"S{n:02d}-EXAM" for n in range(14, 27)],
        "required_projects": ["CP-N2-A", "CP-N2-B", "CP-N2-C"],
        "critical_competencies": [],
        "verification_mode": "local_only",
        "status": "active",
        "newbie_friendly_description": (
            "You finished Phase 1, the 'Independent Practitioner' phase "
            "(sections 14 through 26). 'Independent practitioner' here means "
            "the curriculum is no longer walking you step-by-step through every "
            "line of code. This marker says you completed the walk; it does not "
            "say you are now a Senior anything. It just says you did the work."
        ),
    },
    {
        "badge_id": "progress_phase2_walked",
        "name": "Phase 2 — Advanced Walked",
        "public_claim": (
            "The learner has completed all 13 sections of PyArcana Phase 2 "
            "(Advanced Applied): S27 through S39, including the You Do project, "
            "self-check, and section exam for each section."
        ),
        "non_claims": [
            "Motivational marker only; NOT proof of advanced proficiency.",
            "Does not certify any role, level, or seniority.",
        ],
        "credential_type": "local_achievement",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "python_async", "async_testing", "llmops", "mlops_pipelines",
            "model_deployment", "drift_monitoring", "security_mindset",
            "observability", "cloud_platform", "data_cleaning", "system_design",
            "classical_ml", "deep_learning", "uncertainty_quantification",
            "architecture_leadership", "tradeoff_articulation", "performance_tuning",
            "sql_fundamentals", "sql_window_ctes", "data_validation",
            "business_framing", "metric_design", "stakeholder_translation",
        ],
        "prerequisite_badges": ["progress_phase1_walked"],
        "required_sections": [f"S{n:02d}" for n in range(27, 40)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(27, 40)]
                              + [f"S{n:02d}-EXAM" for n in range(27, 40)],
        "required_projects": ["CP-N3-A", "CP-N3-B", "CP-N3-C"],
        "critical_competencies": [],
        "verification_mode": "local_only",
        "status": "active",
        "newbie_friendly_description": (
            "You finished Phase 2, the 'Advanced Applied' phase (sections 27 "
            "through 39). 'Advanced applied' means the work gets more open-ended: "
            "fewer handrails, more design decisions. This marker is just a "
            "motivational record that you walked through every section, You Do, "
            "and self-check. It is not a job title."
        ),
    },
    {
        "badge_id": "progress_phase3_walked",
        "name": "Phase 3 — Mastery Walked",
        "public_claim": (
            "The learner has completed all 13 sections of PyArcana Phase 3 "
            "(Integrated Mastery): S40 through S52, including the You Do project, "
            "self-check, and section exam for each section."
        ),
        "non_claims": [
            "Motivational marker only; NOT proof of mastery.",
            "Does not certify any role, level, or seniority.",
            "Does not authorize use of the word 'Master' or 'Senior' in any "
            "occupational context.",
        ],
        "credential_type": "local_achievement",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "architecture_leadership", "system_design", "code_review_literacy",
            "deep_learning", "llmops", "mlops_pipelines", "drift_monitoring",
            "observability", "data_cleaning", "python_core", "ci_cd",
            "cloud_platform", "docker", "kubernetes", "performance_tuning",
            "git_workflow", "mentoring", "security_mindset",
            "ai_code_review_literacy", "stakeholder_management",
            "data_validation", "stakeholder_translation",
            "oral_communication", "written_communication", "business_framing",
            "tradeoff_articulation",
        ],
        "prerequisite_badges": ["progress_phase2_walked"],
        "required_sections": [f"S{n:02d}" for n in range(40, 53)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(40, 53)]
                              + [f"S{n:02d}-EXAM" for n in range(40, 53)],
        "required_projects": ["CP-N4-A", "CP-N4-B", "CP-N4-C"],
        "critical_competencies": [],
        "verification_mode": "local_only",
        "status": "active",
        "newbie_friendly_description": (
            "You finished Phase 3, the 'Integrated Mastery' phase (sections 40 "
            "through 52). 'Integrated mastery' here is a curriculum-internal "
            "label meaning the work pulls together everything from earlier "
            "phases into one synthetic project. It is NOT an industry job "
            "title. This marker just says you walked through the section work."
        ),
    },
    {
        "badge_id": "progress_journey_completed",
        "name": "PyArcana Journey Completed",
        "public_claim": (
            "The learner has walked all 52 sections of PyArcana and completed "
            "every You Do, self-check, and section exam, plus every phase-level "
            "capstone referenced in the curriculum (CP-N1-A through CP-N4-C "
            "and CP-FINAL)."
        ),
        "non_claims": [
            "Motivational marker only; NOT proof of any occupational competency.",
            "Does not certify any role, level, or seniority.",
            "Does not by itself satisfy any applied-skill or capstone credential "
            "rubric; it only records that the guided learning journey was walked.",
        ],
        "credential_type": "local_achievement",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [],
        "prerequisite_badges": [
            "progress_phase0_walked", "progress_phase1_walked",
            "progress_phase2_walked", "progress_phase3_walked",
        ],
        "required_sections": [f"S{n:02d}" for n in range(1, 53)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(1, 53)]
                              + [f"S{n:02d}-EXAM" for n in range(1, 53)],
        "required_projects": [
            "CP-N1-A", "CP-N1-B", "CP-N1-C",
            "CP-N2-A", "CP-N2-B", "CP-N2-C",
            "CP-N3-A", "CP-N3-B", "CP-N3-C",
            "CP-N4-A", "CP-N4-B", "CP-N4-C",
            "CP-FINAL",
        ],
        "critical_competencies": [],
        "verification_mode": "local_only",
        "status": "active",
        "newbie_friendly_description": (
            "You walked the whole course: all 52 sections, all 13 capstones "
            "(a capstone is a larger project at the end of a curriculum phase "
            "that pulls together everything you learned). This marker says you "
            "finished the journey. It does NOT say you are job-ready for any "
            "specific role — that's what the verified credentials further down "
            "the stack are for."
        ),
    },
]

# ---------------------------------------------------------------------------
# Badge family 2 — Applied-skill badges (competency_badge)
# ---------------------------------------------------------------------------

APPLIED_BADGES = [
    {
        "badge_id": "python_data_foundations",
        "name": "Python Data Foundations",
        "public_claim": (
            "The learner has independently demonstrated bounded Python "
            "fundamentals — interpreter setup, version control with Git, "
            "modules and functions, idiomatic Python patterns, OOP basics, "
            "and a working test discipline — by passing section exams and "
            "completing section You Do projects above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Python Developer or any role.",
            "Does not include pandas, NumPy, SQL, or visualization at this level.",
            "Does not imply production-grade Python (no type-safety or "
            "observability evidence is collected).",
            "Does not exempt the learner from any subsequent badge's prerequisites.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "foundation",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "testing_discipline",
            "code_review_literacy", "security_mindset", "data_validation",
        ],
        "prerequisite_badges": [],
        "required_sections": ["S01", "S02", "S03", "S04", "S05"],
        "required_activities": [
            "S01-YOUDO", "S01-EXAM", "S02-YOUDO", "S02-EXAM",
            "S03-YOUDO", "S03-EXAM", "S04-YOUDO", "S04-EXAM",
            "S05-YOUDO", "S05-EXAM",
        ],
        "required_projects": ["BADGE:python_data_foundations:integrator"],
        "critical_competencies": ["reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can set up a Python project from scratch (install Python, "
            "create a virtual environment so dependencies don't clash, push "
            "your code to Git so it's version-controlled), write idiomatic "
            "Python (idiomatic means 'the natural way Python programmers "
            "write it', e.g. list comprehensions instead of for-loops), use "
            "functions and modules to organize code, and write basic tests. "
            "This badge says you can do those things independently — not just "
            "follow along with an instructor."
        ),
    },
    {
        "badge_id": "independent_data_preparation",
        "name": "Independent Data Preparation",
        "public_claim": (
            "The learner has independently demonstrated data preparation "
            "competency — descriptive statistics, pandas/NumPy manipulation, "
            "data cleaning, schema validation — through You Do projects and "
            "section exams above the provisional floor, plus an integrator "
            "exercise on a real (messy) dataset."
        ),
        "non_claims": [
            "Does not certify the learner as a Data Analyst or Data Scientist.",
            "Does not include SQL, BI dashboards, or statistical inference.",
            "Does not include leakage prevention or causal inference.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["data_analyst", "data_scientist"],
        "capability_level": "foundation",
        "skill_nodes": [
            "pandas_numpy", "descriptive_stats", "data_cleaning",
            "data_validation",
        ],
        "prerequisite_badges": ["python_data_foundations"],
        "required_sections": ["S06", "S07", "S08", "S18"],
        "required_activities": [
            "S06-YOUDO", "S06-EXAM", "S07-YOUDO", "S07-EXAM",
            "S08-YOUDO", "S08-EXAM", "S18-YOUDO", "S18-EXAM",
        ],
        "required_projects": ["BADGE:independent_data_preparation:integrator"],
        "critical_competencies": ["reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can take a messy dataset (the kind real companies have, with "
            "missing values, wrong types, and duplicates) and clean it up "
            "using pandas (the most popular Python library for tabular data) "
            "and NumPy (the numerical computing library pandas is built on). "
            "You can compute basic descriptive statistics (mean, median, "
            "standard deviation) and write validation checks that catch data "
            "errors before they reach downstream code. This is independent "
            "work — not following a tutorial."
        ),
    },
    {
        "badge_id": "applied_analytical_reasoning",
        "name": "Applied Analytical Reasoning",
        "public_claim": (
            "The learner has independently demonstrated applied analytical "
            "reasoning — building Python visualizations, publishing a basic "
            "BI-style dashboard, training and evaluating a classical ML model "
            "with appropriate metrics — through You Do projects and section "
            "exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Data Analyst or Data Scientist.",
            "Does not include leakage prevention, A/B testing, or causal "
            "inference at this level.",
            "Does not imply production-grade ML deployment.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["data_analyst", "data_scientist", "ai_ml_engineer"],
        "capability_level": "foundation",
        "skill_nodes": [
            "python_visualization", "bi_tools", "classical_ml",
            "model_evaluation",
        ],
        "prerequisite_badges": ["independent_data_preparation"],
        "required_sections": ["S09", "S10"],
        "required_activities": [
            "S09-YOUDO", "S09-EXAM", "S10-YOUDO", "S10-EXAM",
        ],
        "required_projects": ["BADGE:applied_analytical_reasoning:integrator"],
        "critical_competencies": ["reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can take cleaned data and (a) draw charts that communicate a "
            "point using matplotlib/Seaborn/Plotly (Python visualization "
            "libraries), (b) build a simple BI dashboard (BI = Business "
            "Intelligence; tools like Tableau, Power BI, or Looker turn data "
            "into interactive views for non-technical stakeholders), and (c) "
            "train a classical ML model (classical = scikit-learn algorithms "
            "like Random Forest or Logistic Regression, as opposed to deep "
            "neural networks) and evaluate it with appropriate metrics. "
            "Independent work only."
        ),
    },
    {
        "badge_id": "reliable_automation_development",
        "name": "Reliable Automation Development",
        "public_claim": (
            "The learner has independently demonstrated reliable browser-"
            "automation development — Python-based RPA with Playwright, "
            "process analysis, selector design, and exception handling — "
            "through You Do projects and section exams above the provisional "
            "floor."
        ),
        "non_claims": [
            "Does not certify the learner as an RPA Developer.",
            "Does not include UiPath, Automation Anywhere, or Power Automate "
            "(PyArcana's RPA track is Python-based by design).",
            "Does not include REFramework or Orchestrator operations "
            "(out-of-current-scope; see curriculum gap analysis).",
            "Selector resilience is assessed against a documented UI change "
            "scenario, not against an enterprise-scale deployment.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["rpa_automation_developer"],
        "capability_level": "foundation",
        "skill_nodes": [
            "python_rpa_browser", "process_analysis",
            "exception_handling_rpa", "selector_design",
        ],
        "prerequisite_badges": ["python_data_foundations"],
        "required_sections": ["S13", "S24"],
        "required_activities": [
            "S13-YOUDO", "S13-EXAM", "S24-YOUDO", "S24-EXAM",
        ],
        "required_projects": ["BADGE:reliable_automation_development:integrator"],
        "critical_competencies": ["selector_resilience", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can build a Python-based automation script (using Playwright "
            "or Selenium — libraries that drive a browser programmatically) "
            "that doesn't break the moment the website changes. 'Selector "
            "design' means picking stable references to page elements (like "
            "CSS IDs or data-test attributes) instead of brittle ones (like "
            "the third button on the page). 'Exception handling' means your "
            "script recovers gracefully when something goes wrong, instead of "
            "crashing. RPA (Robotic Process Automation) is the broader field "
            "of automating repetitive computer tasks."
        ),
    },
    {
        "badge_id": "applied_sql_query_development",
        "name": "Applied SQL Query Development",
        "public_claim": (
            "The learner has independently demonstrated applied SQL "
            "competency — SELECT/JOIN/GROUP BY, ORM-mapped queries, window "
            "functions and CTEs — through You Do projects and section exams "
            "above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Data Analyst or Data Scientist.",
            "Does NOT include SQL performance tuning (query plans, indexes, "
            "partitioning). This sub-competency is a known curriculum gap; "
            "the badge is issued at 'pilot' status until Phase 4 closes the "
            "gap. Holders of the pilot badge must not represent SQL "
            "performance-tuning competency.",
            "Critical competency `sql_competency` is therefore assessed at "
            "partial coverage (2 of 3 sub-skills).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["data_analyst", "data_scientist"],
        "capability_level": "independent_practitioner",
        "skill_nodes": ["sql_fundamentals", "sql_window_ctes"],
        "prerequisite_badges": ["python_data_foundations"],
        "required_sections": ["S19", "S37"],
        "required_activities": [
            "S19-YOUDO", "S19-EXAM", "S37-YOUDO", "S37-EXAM",
        ],
        "required_projects": ["BADGE:applied_sql_query_development:integrator"],
        "critical_competencies": ["sql_competency"],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can write SQL (Structured Query Language — the standard "
            "language for talking to databases) at the level hiring managers "
            "expect: SELECT, JOIN, GROUP BY (which groups rows that share a "
            "value), window functions (computations across a set of rows "
            "related to the current row, like running totals), and CTEs "
            "(Common Table Expressions — named subqueries that make complex "
            "queries readable). This is the skill that hiring managers "
            "auto-reject candidates for missing. NOTE: This badge is at "
            "'pilot' status because the curriculum doesn't yet teach SQL "
            "performance tuning (making queries fast on big tables). Holders "
            "should not claim performance-tuning expertise."
        ),
    },
    {
        "badge_id": "production_python_delivery_foundations",
        "name": "Production Python Delivery Foundations",
        "public_claim": (
            "The learner has independently demonstrated production-ready "
            "Python delivery foundations — packaging, CI/CD, FastAPI service "
            "design, and a working test discipline — through You Do projects "
            "and section exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Production Python Engineer or "
            "Software Engineer.",
            "Does NOT include static type checking with mypy/Pyright. "
            "`python_type_safety` is a known curriculum gap; the badge is "
            "issued at 'pilot' status until Phase 4 closes the gap.",
            "Does not include observability, Kubernetes, or advanced "
            "performance tuning at this level.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": [
            "production_python_engineer", "ai_ml_engineer",
            "data_scientist",
        ],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "packaging_reproducibility", "ci_cd", "python_core",
            "python_idioms", "system_design", "testing_discipline",
        ],
        "prerequisite_badges": ["python_data_foundations"],
        "required_sections": ["S15", "S17", "S21"],
        "required_activities": [
            "S15-YOUDO", "S15-EXAM", "S17-YOUDO", "S17-EXAM",
            "S21-YOUDO", "S21-EXAM",
        ],
        "required_projects": ["BADGE:production_python_delivery_foundations:integrator"],
        "critical_competencies": ["type_safety_production_hardening", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can package Python code so other people can install and run "
            "it (with a `pyproject.toml` file and pinned dependencies), set up "
            "CI/CD (Continuous Integration / Continuous Deployment — automated "
            "pipelines that run tests and deploy code when you push), build a "
            "FastAPI service (a modern Python web framework), and write tests "
            "for it. NOTE: 'Pilot' status because the curriculum doesn't yet "
            "teach type annotations and mypy/Pyright (tools that catch type "
            "errors before runtime). Holders should not claim type-safety "
            "expertise until Phase 4 closes this gap."
        ),
    },
    {
        "badge_id": "responsible_machine_learning_evaluation",
        "name": "Responsible Machine Learning Evaluation",
        "public_claim": (
            "The learner has independently demonstrated responsible ML "
            "evaluation — training and evaluating classical and deep learning "
            "models with appropriate metrics and a written evaluation memo — "
            "through You Do projects and section exams above the provisional "
            "floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Data Scientist or AI/ML Engineer.",
            "Does NOT include data leakage prevention as a graded skill. "
            "`leakage_prevention` is a known curriculum gap; the badge is "
            "issued at 'pilot' status until Phase 4 closes the gap. Holders "
            "must not represent leakage-prevention competency.",
            "Does not include production deployment, drift monitoring, or "
            "uncertainty quantification at this level.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["data_scientist", "ai_ml_engineer"],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "classical_ml", "model_evaluation", "deep_learning",
        ],
        "prerequisite_badges": ["applied_analytical_reasoning"],
        "required_sections": ["S10", "S23"],
        "required_activities": [
            "S10-YOUDO", "S10-EXAM", "S23-YOUDO", "S23-EXAM",
        ],
        "required_projects": ["BADGE:responsible_machine_learning_evaluation:integrator"],
        "critical_competencies": ["leakage_prevention", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can train a machine-learning model (both classical models "
            "like Random Forest and deep-learning models built with PyTorch "
            "or TensorFlow) and evaluate it honestly. 'Evaluate honestly' "
            "means picking metrics that match the business question (not just "
            "accuracy), comparing to a baseline, and writing down where the "
            "model fails. NOTE: 'Pilot' status because the curriculum doesn't "
            "yet teach data leakage prevention (the #1 way ML evaluations "
            "become lies — when info from the test set accidentally leaks "
            "into training). Holders should not claim leakage-prevention "
            "expertise until Phase 4 closes this gap."
        ),
    },
    {
        "badge_id": "applied_rag_llm_service_development",
        "name": "Applied RAG and LLM Service Development",
        "public_claim": (
            "The learner has independently demonstrated applied RAG and LLM "
            "service development — building a Retrieval-Augmented Generation "
            "pipeline, exposing it as a tested FastAPI service, and "
            "documenting design tradeoffs — through You Do projects and "
            "section exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as an AI/ML Engineer.",
            "Does not include LLM fine-tuning, graph-RAG, or production LLMOps "
            "(those are separate, later badges).",
            "Does not claim the LLM is 'safe' or 'aligned' — only that the "
            "service architecture is sound.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["ai_ml_engineer", "production_python_engineer"],
        "capability_level": "independent_practitioner",
        "skill_nodes": ["llmops", "python_core", "system_design", "testing_discipline"],
        "prerequisite_badges": ["production_python_delivery_foundations"],
        "required_sections": ["S20", "S21"],
        "required_activities": [
            "S20-YOUDO", "S20-EXAM", "S21-YOUDO", "S21-EXAM",
        ],
        "required_projects": ["BADGE:applied_rag_llm_service_development:integrator"],
        "critical_competencies": ["reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can build a RAG application (RAG = Retrieval-Augmented "
            "Generation; it means: when the LLM is asked a question, first "
            "search a knowledge base for relevant context, then feed that "
            "context to the LLM so its answer is grounded in your data "
            "instead of made up) and expose it as a FastAPI web service with "
            "tests. 'LLM' = Large Language Model, like GPT or Claude."
        ),
    },
    {
        "badge_id": "reliable_async_python_development",
        "name": "Reliable Async Python Development",
        "public_claim": (
            "The learner has independently demonstrated reliable async "
            "Python development — asyncio, async testing with pytest-asyncio, "
            "LLM agent orchestration, and observable streaming data "
            "processing — through You Do projects and section exams above "
            "the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Production Python Engineer.",
            "Does not include distributed-systems mastery or k8s operation.",
            "Does not by itself satisfy the Production Python Delivery "
            "Foundations badge's type-safety requirements.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": [
            "production_python_engineer", "ai_ml_engineer",
            "data_scientist",
        ],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "python_async", "async_testing", "llmops", "observability",
            "data_cleaning",
        ],
        "prerequisite_badges": ["production_python_delivery_foundations"],
        "required_sections": ["S27", "S28", "S31"],
        "required_activities": [
            "S27-YOUDO", "S27-EXAM", "S28-YOUDO", "S28-EXAM",
            "S31-YOUDO", "S31-EXAM",
        ],
        "required_projects": ["BADGE:reliable_async_python_development:integrator"],
        "critical_competencies": ["reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can write async Python (using `async`/`await` and the "
            "`asyncio` library so your program can do many things at once "
            "instead of waiting for each one in turn — important when calling "
            "slow APIs or databases). You can test async code with "
            "`pytest-asyncio` (a pytest plugin for async tests), orchestrate "
            "LLM agents (programs that decide what to call next on an LLM), "
            "and process streaming data (data that arrives continuously, like "
            "logs or sensor readings) with proper observability (logging, "
            "metrics, and tracing so you can see what your code is doing)."
        ),
    },
    {
        "badge_id": "applied_mlops_pipeline_delivery",
        "name": "Applied MLOps Pipeline Delivery",
        "public_claim": (
            "The learner has independently demonstrated applied MLOps "
            "pipeline delivery — model deployment, drift monitoring, "
            "retraining triggers, and pipeline observability — through You Do "
            "projects and section exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as an AI/ML Engineer.",
            "Does not include deep-learning model architecture design or "
            "fine-tuning at this level.",
            "Does not by itself satisfy the Responsible ML Evaluation badge's "
            "leakage-prevention requirement (which remains at 'pilot' status).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["ai_ml_engineer", "data_scientist"],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "mlops_pipelines", "model_deployment", "drift_monitoring",
            "observability", "llmops",
        ],
        "prerequisite_badges": [
            "production_python_delivery_foundations",
            "applied_rag_llm_service_development",
        ],
        "required_sections": ["S29", "S43"],
        "required_activities": [
            "S29-YOUDO", "S29-EXAM", "S43-YOUDO", "S43-EXAM",
        ],
        "required_projects": ["BADGE:applied_mlops_pipeline_delivery:integrator"],
        "critical_competencies": ["mlops_fluency", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can deploy a machine-learning model to production (not just "
            "save it to a file, but serve it behind an API with health checks "
            "and latency budgets), monitor it for drift (drift = the data the "
            "model sees in production slowly changing until predictions "
            "become wrong), trigger retrains automatically when drift is "
            "detected, and make the whole pipeline observable (so you can "
            "debug it when things break). MLOps (Machine Learning Operations) "
            "is the engineering discipline of running ML in production."
        ),
    },
    {
        "badge_id": "production_python_hardening_practice",
        "name": "Production Python Hardening Practice",
        "public_claim": (
            "The learner has independently demonstrated production Python "
            "hardening — security mindset, observability, cloud-platform "
            "deployment, async service design, and performance tuning — "
            "through You Do projects and section exams above the provisional "
            "floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior Production Python Engineer.",
            "Does NOT include static type-safety evidence (pilot badge until "
            "Phase 4 closes the gap).",
            "Does not include Kubernetes operation at this level (separate, "
            "later badge).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["production_python_engineer", "ai_ml_engineer"],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "security_mindset", "observability", "cloud_platform",
            "system_design", "python_async", "performance_tuning",
        ],
        "prerequisite_badges": [
            "production_python_delivery_foundations",
            "reliable_async_python_development",
        ],
        "required_sections": ["S30", "S32", "S38"],
        "required_activities": [
            "S30-YOUDO", "S30-EXAM", "S32-YOUDO", "S32-EXAM",
            "S38-YOUDO", "S38-EXAM",
        ],
        "required_projects": ["BADGE:production_python_hardening_practice:integrator"],
        "critical_competencies": ["type_safety_production_hardening", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can harden a Python service for production: apply a security "
            "mindset (OWASP Top 10 — the standard list of web-app security "
            "risks like injection and broken authentication), instrument it "
            "with observability (structured logs in JSON, OpenTelemetry "
            "tracing, Prometheus metrics), deploy to a cloud platform (AWS, "
            "GCP, or Azure), and tune its performance (profiling, "
            "bottleneck-finding, optimization). NOTE: 'Pilot' status because "
            "static type-safety (mypy/Pyright) is still a curriculum gap."
        ),
    },
    {
        "badge_id": "applied_deep_learning_practice",
        "name": "Applied Deep Learning Practice",
        "public_claim": (
            "The learner has independently demonstrated applied deep-learning "
            "practice — training deep neural networks, evaluating uncertainty, "
            "comparing to classical baselines — through You Do projects and "
            "section exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as an AI/ML Engineer.",
            "Does NOT include data leakage prevention as a graded skill "
            "(pilot badge; see curriculum gap).",
            "Does not include LLM fine-tuning or production serving.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["ai_ml_engineer", "data_scientist"],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "classical_ml", "deep_learning", "uncertainty_quantification",
            "python_core",
        ],
        "prerequisite_badges": ["responsible_machine_learning_evaluation"],
        "required_sections": ["S33", "S34"],
        "required_activities": [
            "S33-YOUDO", "S33-EXAM", "S34-YOUDO", "S34-EXAM",
        ],
        "required_projects": ["BADGE:applied_deep_learning_practice:integrator"],
        "critical_competencies": ["leakage_prevention", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can train deep neural networks (multi-layer models like CNNs "
            "for images or transformers for text, using PyTorch or "
            "TensorFlow), quantify their uncertainty (a model that says 'I'm "
            "90% sure' should be right ~90% of the time; if it says 'I'm 90% "
            "sure' but is right only 60% of the time, it's badly calibrated), "
            "and compare deep-learning results to a classical baseline (a "
            "simpler model like Random Forest) so you can argue whether the "
            "extra complexity was worth it. NOTE: 'Pilot' status because "
            "leakage prevention is a curriculum gap."
        ),
    },
    {
        "badge_id": "architecture_decision_practice",
        "name": "Architecture Decision Practice",
        "public_claim": (
            "The learner has independently demonstrated architecture-decision "
            "practice — system design, DDD (domain-driven design) decisions, "
            "code-review literacy, and tradeoff articulation — through You Do "
            "projects and section exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior Engineer, Staff "
            "Engineer, or Architect.",
            "Does not certify team-leadership or multi-team multiplier impact.",
            "Architecture decisions are assessed against a documented "
            "scenario, not against multi-quarter enterprise rollout.",
            "BLOCKED ON DYNAMIC LMS by GAP-P0-005 (DIV-001: section 40 ID "
            "mismatch in `prisma/seed.ts:11743`). The S40 exam activity is "
            "unattainable on the dynamic LMS until the seed ID is corrected "
            "from `'agentic-architecture'` to `'architecture-ddd-decisions'`. "
            "On the static GitHub Pages edition, S40 reads from the section "
            "source file and is unaffected. Once GAP-P0-005 is closed, "
            "this badge is fully attainable on both editions. The badge "
            "remains `active` status because the curriculum content is "
            "complete; only the dynamic-LMS exam-attempt evidence is blocked.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": [
            "production_python_engineer", "ai_ml_engineer",
            "rpa_automation_developer",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "system_design", "architecture_leadership",
            "tradeoff_articulation", "code_review_literacy",
        ],
        "prerequisite_badges": [
            "production_python_delivery_foundations",
            "reliable_async_python_development",
        ],
        "required_sections": ["S35", "S40"],
        "required_activities": [
            "S35-YOUDO", "S35-EXAM", "S40-YOUDO", "S40-EXAM",
        ],
        "required_projects": ["BADGE:architecture_decision_practice:integrator"],
        "critical_competencies": [
            "business_framing_judgment", "communication_audience_tuned",
            "reproducibility_determinism",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can make and document architecture decisions for a software "
            "system. 'System design' = deciding how to break a system into "
            "services, what each one does, and how they talk. 'DDD' (Domain-"
            "Driven Design) = modeling the code around the real-world business "
            "domain so the code structure matches how the business thinks. "
            "'Tradeoff articulation' = writing down at least two options, "
            "their pros and cons, the choice you made, and when you'd revisit "
            "it. You can also do code review (reading others' code "
            "constructively to catch bugs and suggest improvements)."
        ),
    },
    {
        "badge_id": "llmops_production_delivery",
        "name": "LLMOps Production Delivery",
        "public_claim": (
            "The learner has independently demonstrated LLMOps production "
            "delivery — fine-tuning, graph-RAG, drift monitoring, "
            "observability — through You Do projects and section exams above "
            "the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior AI/ML Engineer.",
            "Does not include multimodal model training or GPU-compute tuning.",
            "Does not claim the LLM is 'safe' or 'aligned' — only that the "
            "production LLMOps pipeline is sound.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["ai_ml_engineer"],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "deep_learning", "llmops", "mlops_pipelines",
            "drift_monitoring", "observability", "data_cleaning",
            "python_core",
        ],
        "prerequisite_badges": [
            "applied_rag_llm_service_development",
            "applied_mlops_pipeline_delivery",
        ],
        "required_sections": ["S41", "S42", "S43"],
        "required_activities": [
            "S41-YOUDO", "S41-EXAM", "S42-YOUDO", "S42-EXAM",
            "S43-YOUDO", "S43-EXAM",
        ],
        "required_projects": ["BADGE:llmops_production_delivery:integrator"],
        "critical_competencies": ["mlops_fluency", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can run an LLM (Large Language Model) in production: "
            "fine-tune it (continue training on your own data so it's better "
            "at your specific task), build a graph-RAG (RAG where the "
            "retrieval uses a knowledge graph — a network of entities and "
            "their relationships — instead of plain text search), monitor it "
            "for drift (LLM behavior changes when the input distribution "
            "shifts), and observe it in production (logs, metrics, tracing). "
            "LLMOps (Large Language Model Operations) is the engineering "
            "discipline of running LLMs in production."
        ),
    },
    {
        "badge_id": "container_platform_engineering_practice",
        "name": "Container Platform Engineering Practice",
        "public_claim": (
            "The learner has independently demonstrated container-platform "
            "engineering practice — Docker, Kubernetes, CI/CD, cloud "
            "platforms, and GPU performance tuning — through You Do projects "
            "and section exams above the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior Production Python "
            "Engineer or DevOps Engineer.",
            "Does not include multi-region failover or service-mesh operation.",
            "Does NOT include static type-safety evidence (pilot badge until "
            "Phase 4 closes the gap).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": [
            "production_python_engineer", "ai_ml_engineer",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "ci_cd", "cloud_platform", "docker", "kubernetes",
            "deep_learning", "performance_tuning",
        ],
        "prerequisite_badges": [
            "production_python_delivery_foundations",
            "production_python_hardening_practice",
        ],
        "required_sections": ["S45", "S46"],
        "required_activities": [
            "S45-YOUDO", "S45-EXAM", "S46-YOUDO", "S46-EXAM",
        ],
        "required_projects": ["BADGE:container_platform_engineering_practice:integrator"],
        "critical_competencies": ["type_safety_production_hardening", "reproducibility_determinism"],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can deploy software using containers (Docker — packages your "
            "code plus its dependencies into a single runnable unit so it "
            "behaves the same everywhere) and orchestrate them at scale "
            "(Kubernetes — manages many containers across many machines, "
            "handling restarts, scaling, and networking). You can do this "
            "via CI/CD (automated deployment pipelines) on a cloud platform "
            "(AWS, GCP, or Azure), including for GPU workloads (deep-learning "
            "training that needs specialized graphics-card hardware). NOTE: "
            "'Pilot' status because static type-safety is still a curriculum "
            "gap."
        ),
    },
    {
        "badge_id": "ai_governance_code_review_practice",
        "name": "AI Governance and Code Review Practice",
        "public_claim": (
            "The learner has independently demonstrated AI-governance and "
            "code-review practice — open-source contribution, AI code-review "
            "literacy, AI governance, data-contract design, stakeholder "
            "translation — through You Do projects and section exams above "
            "the provisional floor."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior Engineer, Tech Lead, or "
            "AI Governance Officer.",
            "Does not include formal legal/compliance sign-off authority.",
            "Does not by itself satisfy the Container Platform Engineering or "
            "LLMOps Production Delivery badges' production requirements.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": [
            "production_python_engineer", "ai_ml_engineer",
            "data_scientist",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "code_review_literacy", "git_workflow", "mentoring",
            "security_mindset", "ai_code_review_literacy",
            "data_validation", "data_cleaning", "stakeholder_translation",
        ],
        "prerequisite_badges": [
            "architecture_decision_practice",
            "container_platform_engineering_practice",
        ],
        "required_sections": ["S47", "S48", "S49"],
        "required_activities": [
            "S47-YOUDO", "S47-EXAM", "S48-YOUDO", "S48-EXAM",
            "S49-YOUDO", "S49-EXAM",
        ],
        "required_projects": ["BADGE:ai_governance_code_review_practice:integrator"],
        "critical_competencies": [
            "business_framing_judgment", "communication_audience_tuned",
            "reproducibility_determinism",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can review AI-generated code critically (not just accept "
            "what Copilot or Cursor suggests — check it for bugs, security "
            "issues, and correctness), contribute to open-source projects "
            "(public codebases where anyone can submit changes via Pull "
            "Requests), apply AI governance (rules and processes for "
            "responsible AI use in an organization), design data contracts "
            "(explicit agreements between teams about what shape data will "
            "have, so downstream code doesn't break when schemas change), "
            "and translate technical findings for non-technical stakeholders."
        ),
    },
]

# ---------------------------------------------------------------------------
# Badge family 3 — Cross-section capability badges (competency_badge)
# ---------------------------------------------------------------------------

CROSS_SECTION_BADGES = [
    {
        "badge_id": "integrated_data_analyst_practice",
        "name": "Integrated Data Analyst Practice",
        "public_claim": (
            "The learner has independently synthesized Python data foundations, "
            "independent data preparation, applied analytical reasoning, and "
            "applied SQL query development into a single integrated Data "
            "Analyst-style project with a documented business framing, a "
            "reproducible pipeline, and an audience-tuned writeup."
        ),
        "non_claims": [
            "Does not certify the learner as a Data Analyst at any seniority "
            "level (Junior, Mid, Senior, Lead, etc.).",
            "Does not include production BI deployment or experimental design.",
            "SQL performance tuning is NOT included (curriculum gap; the "
            "Applied SQL Query Development badge is at pilot status).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["data_analyst"],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "pandas_numpy", "descriptive_stats",
            "data_cleaning", "data_validation", "python_visualization",
            "bi_tools", "classical_ml", "model_evaluation",
            "sql_fundamentals", "sql_window_ctes",
            "business_framing", "stakeholder_translation",
            "written_communication",
        ],
        "prerequisite_badges": [
            "python_data_foundations",
            "independent_data_preparation",
            "applied_analytical_reasoning",
            "applied_sql_query_development",
        ],
        "required_sections": ["S06", "S07", "S08", "S09", "S10", "S19", "S37"],
        "required_activities": [
            "S06-YOUDO", "S07-YOUDO", "S08-YOUDO", "S09-YOUDO",
            "S10-YOUDO", "S19-YOUDO", "S37-YOUDO",
        ],
        "required_projects": ["BADGE:integrated_data_analyst_practice:integrator"],
        "critical_competencies": [
            "sql_competency", "reproducibility_determinism",
            "communication_audience_tuned", "business_framing_judgment",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can do an end-to-end Data-Analyst-style project: frame a "
            "business question (what decision will this answer support?), "
            "pull data with SQL (including window functions and CTEs — see "
            "the Applied SQL badge description), clean and validate it with "
            "pandas, compute descriptive statistics, build a Python "
            "visualization and a BI dashboard, train a simple classical ML "
            "model as a baseline, and write a 1-pager a non-technical PM "
            "(Project Manager) can act on. 'Integrated' means you do all of "
            "this in one project, not as disconnected exercises. NOTE: this "
            "badge does NOT make you a 'Data Analyst' — that's a job title "
            "that depends on the company. It says you can do "
            "Data-Analyst-style work independently."
        ),
    },
    {
        "badge_id": "integrated_data_science_practice",
        "name": "Integrated Data Science Practice",
        "public_claim": (
            "The learner has independently synthesized Python data foundations, "
            "independent data preparation, applied analytical reasoning, "
            "applied SQL query development, and responsible ML evaluation "
            "into a single integrated Data-Science-style project with a "
            "documented model card, leakage-prevention review, and an "
            "audience-tuned writeup."
        ),
        "non_claims": [
            "Does not certify the learner as a Data Scientist at any seniority "
            "level (Junior, Mid, Senior, Staff, Principal).",
            "Leakage prevention is NOT yet a graded skill (curriculum gap; "
            "the Responsible ML Evaluation badge is at pilot status). The "
            "integrated project rubric requires the learner to articulate "
            "leakage risks from first principles instead.",
            "Does not include causal inference, A/B testing, or experimental "
            "design at this level (curriculum gaps; deferred to Phase 4).",
            "Does not include production deployment (deferred to "
            "integrated_ml_engineering_practice).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["data_scientist"],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "pandas_numpy", "descriptive_stats",
            "data_cleaning", "data_validation", "python_visualization",
            "bi_tools", "classical_ml", "model_evaluation", "deep_learning",
            "sql_fundamentals", "sql_window_ctes",
            "business_framing", "stakeholder_translation",
            "written_communication", "metric_design",
        ],
        "prerequisite_badges": [
            "python_data_foundations",
            "independent_data_preparation",
            "applied_analytical_reasoning",
            "applied_sql_query_development",
            "responsible_machine_learning_evaluation",
        ],
        "required_sections": ["S06", "S07", "S08", "S09", "S10", "S19", "S23", "S37"],
        "required_activities": [
            "S06-YOUDO", "S07-YOUDO", "S08-YOUDO", "S09-YOUDO",
            "S10-YOUDO", "S19-YOUDO", "S23-YOUDO", "S37-YOUDO",
        ],
        "required_projects": ["BADGE:integrated_data_science_practice:integrator"],
        "critical_competencies": [
            "sql_competency", "leakage_prevention",
            "reproducibility_determinism", "communication_audience_tuned",
            "business_framing_judgment",
        ],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can do an end-to-end Data-Science-style project: everything "
            "in the Data Analyst integrated project, PLUS train and evaluate "
            "a machine-learning model (classical or deep learning) and write "
            "a model card (a short document describing what the model does, "
            "what data it was trained on, how it was evaluated, where it "
            "fails, and how it should be used). You must articulate — from "
            "first principles — how you prevented data leakage (the #1 way "
            "ML evaluations become lies). NOTE: 'Pilot' status because the "
            "curriculum doesn't yet teach leakage prevention formally; you "
            "have to demonstrate it via a supplementary exercise. NOTE: this "
            "badge does NOT make you a 'Data Scientist' — that's a job title. "
            "It says you can do Data-Science-style work independently."
        ),
    },
    {
        "badge_id": "integrated_ml_engineering_practice",
        "name": "Integrated ML Engineering Practice",
        "public_claim": (
            "The learner has independently synthesized Python data foundations, "
            "applied analytical reasoning, responsible ML evaluation, RAG/LLM "
            "service development, and applied MLOps pipeline delivery into a "
            "single integrated ML-Engineering-style project with a deployed "
            "model, a drift-monitoring stub, and an audience-tuned handoff "
            "document."
        ),
        "non_claims": [
            "Does not certify the learner as an AI/ML Engineer at any "
            "seniority level (Junior, Mid, Senior, Staff, Principal).",
            "Leakage prevention is NOT yet a graded skill (curriculum gap).",
            "Does not include multimodal or GPU-compute optimization at this "
            "level (deferred to LLMOps Production Delivery).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["ai_ml_engineer"],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "classical_ml", "model_evaluation",
            "deep_learning", "llmops", "system_design", "testing_discipline",
            "ci_cd", "mlops_pipelines", "model_deployment", "drift_monitoring",
            "observability", "business_framing", "stakeholder_translation",
            "metric_design",
        ],
        "prerequisite_badges": [
            "python_data_foundations",
            "applied_analytical_reasoning",
            "responsible_machine_learning_evaluation",
            "applied_rag_llm_service_development",
            "applied_mlops_pipeline_delivery",
        ],
        "required_sections": ["S09", "S10", "S20", "S21", "S23", "S29", "S43"],
        "required_activities": [
            "S09-YOUDO", "S10-YOUDO", "S20-YOUDO", "S21-YOUDO",
            "S23-YOUDO", "S29-YOUDO", "S43-YOUDO",
        ],
        "required_projects": ["BADGE:integrated_ml_engineering_practice:integrator"],
        "critical_competencies": [
            "leakage_prevention", "mlops_fluency",
            "reproducibility_determinism", "communication_audience_tuned",
            "business_framing_judgment",
        ],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can do an end-to-end ML-Engineering-style project: train a "
            "model, deploy it as a service behind an API with health checks "
            "and latency budgets, wire it into a CI/CD pipeline that "
            "retrains on drift, monitor it in production, and hand it off to "
            "a stakeholder with a 1-page writeup. NOTE: 'Pilot' status "
            "because leakage prevention is a curriculum gap. NOTE: this badge "
            "does NOT make you an 'AI/ML Engineer' — that's a job title. It "
            "says you can do ML-Engineering-style work independently."
        ),
    },
    {
        "badge_id": "integrated_automation_engineering_practice",
        "name": "Integrated Automation Engineering Practice",
        "public_claim": (
            "The learner has independently synthesized Python data foundations, "
            "reliable automation development, and RAG/LLM service development "
            "into a single integrated Automation-Engineering-style project "
            "with a process-decomposition memo, a UI-change-resilient bot, "
            "and an audience-tuned handoff document."
        ),
        "non_claims": [
            "Does not certify the learner as an RPA Developer at any "
            "seniority level (Junior, Mid, Senior, Lead).",
            "Does not include UiPath, Automation Anywhere, Power Automate, "
            "or REFramework (PyArcana's RPA track is Python-based).",
            "Selector resilience is assessed against a documented UI change "
            "scenario, not against enterprise-scale deployment.",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["rpa_automation_developer"],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "python_rpa_browser",
            "process_analysis", "exception_handling_rpa", "selector_design",
            "llmops", "system_design", "testing_discipline",
            "business_framing", "stakeholder_translation",
        ],
        "prerequisite_badges": [
            "python_data_foundations",
            "reliable_automation_development",
            "applied_rag_llm_service_development",
        ],
        "required_sections": ["S13", "S20", "S21", "S24"],
        "required_activities": [
            "S13-YOUDO", "S20-YOUDO", "S21-YOUDO", "S24-YOUDO",
        ],
        "required_projects": ["BADGE:integrated_automation_engineering_practice:integrator"],
        "critical_competencies": [
            "selector_resilience", "reproducibility_determinism",
            "communication_audience_tuned", "business_framing_judgment",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You can do an end-to-end Automation-Engineering-style project: "
            "decompose a business process (decide which steps to automate, "
            "which to re-engineer, which to leave alone — and write that "
            "down), build a Python-based bot that survives a documented UI "
            "change (using stable selectors + exception handling), wire it "
            "into a tested service, and hand it off with a 1-page writeup. "
            "NOTE: this badge does NOT make you an 'RPA Developer' — that's "
            "a job title. It says you can do Automation-Engineering-style "
            "work independently in PyArcana's Python-based RPA track."
        ),
    },
    {
        "badge_id": "integrated_production_python_practice",
        "name": "Integrated Production Python Practice",
        "public_claim": (
            "The learner has independently synthesized Python data foundations, "
            "production Python delivery foundations, reliable async Python "
            "development, and production Python hardening practice into a "
            "single integrated Production-Python-style service with "
            "containerized deployment, observability, security review, and "
            "an audience-tuned handoff document."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior Production Python "
            "Engineer or Senior Software Engineer.",
            "Does NOT include static type-safety evidence (pilot badge until "
            "Phase 4 closes the gap).",
            "Does not include Kubernetes operation at scale (deferred to "
            "Container Platform Engineering Practice).",
        ],
        "credential_type": "competency_badge",
        "roles_aligned": ["production_python_engineer"],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "ci_cd", "system_design",
            "testing_discipline", "python_async", "async_testing",
            "observability", "security_mindset", "cloud_platform",
            "performance_tuning", "business_framing",
            "stakeholder_translation", "metric_design",
        ],
        "prerequisite_badges": [
            "python_data_foundations",
            "production_python_delivery_foundations",
            "reliable_async_python_development",
            "production_python_hardening_practice",
        ],
        "required_sections": ["S15", "S17", "S21", "S27", "S28", "S30", "S32", "S38"],
        "required_activities": [
            "S15-YOUDO", "S17-YOUDO", "S21-YOUDO", "S27-YOUDO",
            "S28-YOUDO", "S30-YOUDO", "S32-YOUDO", "S38-YOUDO",
        ],
        "required_projects": ["BADGE:integrated_production_python_practice:integrator"],
        "critical_competencies": [
            "type_safety_production_hardening", "reproducibility_determinism",
            "communication_audience_tuned", "business_framing_judgment",
        ],
        "verification_mode": "server_verified",
        "status": "pilot",
        "newbie_friendly_description": (
            "You can do an end-to-end Production-Python-style project: "
            "package a Python service with proper dependency pinning, "
            "containerize it (Docker), deploy it on a cloud platform "
            "(AWS/GCP/Azure) via CI/CD, instrument it with observability "
            "(structured logs, OpenTelemetry tracing, Prometheus metrics), "
            "apply a security review (OWASP Top 10), tune its performance, "
            "and hand it off with a 1-page writeup. NOTE: 'Pilot' status "
            "because static type-safety (mypy/Pyright) is still a curriculum "
            "gap. NOTE: this badge does NOT make you a 'Production Python "
            "Engineer' — that's a job title. It says you can do "
            "Production-Python-style work independently."
        ),
    },
]

# ---------------------------------------------------------------------------
# Badge family 4 — Capstone credentials (verified_credential)
# ---------------------------------------------------------------------------

CAPSTONE_BADGES = [
    {
        "badge_id": "integrated_python_ai_capstone_foundations",
        "name": "Integrated Python and AI Capstone — Foundations",
        "public_claim": (
            "The learner has completed and defended the three Phase 0 "
            "capstones (CP-N1-A, CP-N1-B, CP-N1-C) at rubric performance "
            "above the provisional floor, with a synthesis writeup "
            "demonstrating foundational-level capability across Python, "
            "data, automation, and visualization."
        ),
        "non_claims": [
            "Does not certify the learner as any role at any seniority level.",
            "Does not imply job-readiness; it certifies only that the "
            "Phase 0 capstone synthesis was independently produced and "
            "defended at the foundational level.",
            "Foundational level means 'can apply with guidance'; it does "
            "NOT mean 'can apply independently in a production setting'.",
        ],
        "credential_type": "verified_credential",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "foundation",
        "skill_nodes": [
            "python_core", "python_idioms", "git_workflow",
            "packaging_reproducibility", "pandas_numpy", "descriptive_stats",
            "data_cleaning", "data_validation", "python_visualization",
            "bi_tools", "classical_ml", "model_evaluation",
            "testing_discipline", "performance_tuning",
            "python_rpa_browser", "process_analysis",
            "exception_handling_rpa", "code_review_literacy",
            "security_mindset",
        ],
        "prerequisite_badges": [
            "progress_phase0_walked",
            "python_data_foundations",
            "independent_data_preparation",
            "applied_analytical_reasoning",
            "reliable_automation_development",
        ],
        "required_sections": [f"S{n:02d}" for n in range(1, 14)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(1, 14)]
                              + [f"S{n:02d}-EXAM" for n in range(1, 14)],
        "required_projects": [
            "CP-N1-A", "CP-N1-B", "CP-N1-C",
            "BADGE:integrated_python_ai_capstone_foundations:synthesis",
        ],
        "critical_competencies": [
            "reproducibility_determinism", "communication_audience_tuned",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You completed all three Phase 0 capstones (CP-N1-A, CP-N1-B, "
            "CP-N1-C — these are the larger projects at the end of "
            "Foundations that pull together everything you learned about "
            "Python, data, automation, and visualization), passed them at "
            "the rubric floor, and wrote a synthesis document that connects "
            "them. 'Capstone credential' is heavier than a 'badge' — it "
            "requires synthesis across multiple sub-projects and a defense "
            "(an oral or written explanation of your choices). "
            "'Foundational' here means 'can apply with guidance' — NOT "
            "'can apply independently in a production setting'."
        ),
    },
    {
        "badge_id": "integrated_python_ai_capstone_independent",
        "name": "Integrated Python and AI Capstone — Independent",
        "public_claim": (
            "The learner has completed and defended the three Phase 1 "
            "capstones (CP-N2-A, CP-N2-B, CP-N2-C) at rubric performance "
            "above the provisional floor, with a synthesis writeup "
            "demonstrating independent-practitioner-level capability across "
            "security, packaging, SQL, RAG, deep learning, and automation."
        ),
        "non_claims": [
            "Does not certify the learner as any role at any seniority level.",
            "Independent-practitioner level means 'can apply independently "
            "within a pre-scoped problem'; it does NOT mean 'can diagnose "
            "novel failure modes or design new systems unsupervised'.",
            "SQL performance tuning and leakage prevention are NOT included "
            "(curriculum gaps; relevant badges remain at pilot status).",
        ],
        "credential_type": "verified_credential",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "independent_practitioner",
        "skill_nodes": [
            "security_mindset", "python_core", "python_idioms",
            "packaging_reproducibility", "stakeholder_management", "ci_cd",
            "data_cleaning", "data_validation", "pandas_numpy",
            "sql_fundamentals", "sql_window_ctes", "llmops", "system_design",
            "testing_discipline", "deep_learning", "classical_ml",
            "python_rpa_browser", "selector_design", "exception_handling_rpa",
            "python_visualization", "bi_tools", "business_framing",
            "process_analysis", "stakeholder_translation",
        ],
        "prerequisite_badges": [
            "integrated_python_ai_capstone_foundations",
            "progress_phase1_walked",
            "applied_sql_query_development",
            "production_python_delivery_foundations",
            "responsible_machine_learning_evaluation",
            "applied_rag_llm_service_development",
        ],
        "required_sections": [f"S{n:02d}" for n in range(14, 27)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(14, 27)]
                              + [f"S{n:02d}-EXAM" for n in range(14, 27)],
        "required_projects": [
            "CP-N2-A", "CP-N2-B", "CP-N2-C",
            "BADGE:integrated_python_ai_capstone_independent:synthesis",
        ],
        "critical_competencies": [
            "reproducibility_determinism", "communication_audience_tuned",
            "business_framing_judgment",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You completed all three Phase 1 capstones (CP-N2-A, CP-N2-B, "
            "CP-N2-C — the integrator projects at the end of Independent "
            "Practitioner that pull together security, packaging, SQL, RAG, "
            "deep learning, and automation), passed them at the rubric "
            "floor, and wrote a synthesis document with explicit business "
            "framing. 'Independent practitioner' means you can do the work "
            "without step-by-step help, but you'd still ask a senior "
            "engineer to review your design before shipping it to "
            "production. NOTE: SQL performance tuning and leakage "
            "prevention are curriculum gaps, so they're not graded here."
        ),
    },
    {
        "badge_id": "integrated_python_ai_capstone_advanced_applied",
        "name": "Integrated Python and AI Capstone — Advanced Applied",
        "public_claim": (
            "The learner has completed and defended the three Phase 2 "
            "capstones (CP-N3-A, CP-N3-B, CP-N3-C) at rubric performance "
            "above the provisional floor, with a synthesis writeup "
            "demonstrating advanced-applied-level capability across async "
            "Python, MLOps, security infrastructure, microservices, system "
            "design, and post-mortem practice."
        ),
        "non_claims": [
            "Does not certify the learner as a Senior Engineer, Staff "
            "Engineer, or any role at any seniority level.",
            "Advanced-applied level means 'can diagnose and design within "
            "an existing system'; it does NOT mean 'can set technical "
            "strategy for an organization'.",
            "Leakage prevention and python_type_safety remain curriculum "
            "gaps; relevant badges remain at pilot status.",
        ],
        "credential_type": "verified_credential",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "advanced_applied",
        "skill_nodes": [
            "python_async", "async_testing", "llmops", "mlops_pipelines",
            "model_deployment", "drift_monitoring", "security_mindset",
            "observability", "cloud_platform", "data_cleaning", "system_design",
            "classical_ml", "deep_learning", "uncertainty_quantification",
            "architecture_leadership", "tradeoff_articulation",
            "performance_tuning", "sql_fundamentals", "sql_window_ctes",
            "data_validation", "business_framing", "metric_design",
            "stakeholder_translation",
        ],
        "prerequisite_badges": [
            "integrated_python_ai_capstone_independent",
            "progress_phase2_walked",
            "reliable_async_python_development",
            "applied_mlops_pipeline_delivery",
            "production_python_hardening_practice",
            "applied_deep_learning_practice",
        ],
        "required_sections": [f"S{n:02d}" for n in range(27, 40)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(27, 40)]
                              + [f"S{n:02d}-EXAM" for n in range(27, 40)],
        "required_projects": [
            "CP-N3-A", "CP-N3-B", "CP-N3-C",
            "BADGE:integrated_python_ai_capstone_advanced_applied:synthesis",
        ],
        "critical_competencies": [
            "reproducibility_determinism", "communication_audience_tuned",
            "business_framing_judgment", "mlops_fluency",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You completed all three Phase 2 capstones (CP-N3-A, CP-N3-B, "
            "CP-N3-C — the integrator projects at the end of Advanced "
            "Applied that pull together async Python, MLOps, security "
            "infrastructure, microservices, system design, and post-mortem "
            "practice), passed them at the rubric floor, and wrote a "
            "synthesis document with explicit business framing and metric "
            "design. 'Advanced applied' means you can diagnose problems in "
            "an existing system and design changes to fix them — but you'd "
            "still consult peers before setting strategy. A 'post-mortem' "
            "is a blameless writeup of what went wrong after an incident."
        ),
    },
    {
        "badge_id": "integrated_python_ai_capstone_integrated_mastery",
        "name": "Integrated Python and AI Capstone — Integrated Mastery",
        "public_claim": (
            "The learner has completed and defended the three Phase 3 "
            "capstones (CP-N4-A, CP-N4-B, CP-N4-C) at rubric performance "
            "above the provisional floor, with a synthesis writeup "
            "demonstrating integrated-mastery-level capability across "
            "architecture decisions, LLMOps, multimodal systems, "
            "infrastructure-as-code, GPU computing, open-source practice, "
            "AI governance, data contracts, and tech leadership."
        ),
        "non_claims": [
            "Does not certify the learner as a Master, Senior, Staff, "
            "Principal, or Distinguished Engineer.",
            "'Integrated mastery' here is a curriculum-internal label for "
            "the cognitive-load level at which the learner integrates "
            "multiple specialization areas into a single defended "
            "synthesis. It is NOT an industry seniority title.",
            "Type-safety and leakage-prevention gaps remain; relevant "
            "badges remain at pilot status.",
        ],
        "credential_type": "verified_credential",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "architecture_leadership", "system_design", "code_review_literacy",
            "deep_learning", "llmops", "mlops_pipelines", "drift_monitoring",
            "observability", "data_cleaning", "python_core", "ci_cd",
            "cloud_platform", "docker", "kubernetes", "performance_tuning",
            "git_workflow", "mentoring", "security_mindset",
            "ai_code_review_literacy", "stakeholder_management",
            "data_validation", "stakeholder_translation",
            "oral_communication", "written_communication", "business_framing",
            "tradeoff_articulation",
        ],
        "prerequisite_badges": [
            "integrated_python_ai_capstone_advanced_applied",
            "progress_phase3_walked",
            "architecture_decision_practice",
            "llmops_production_delivery",
            "container_platform_engineering_practice",
            "ai_governance_code_review_practice",
        ],
        "required_sections": [f"S{n:02d}" for n in range(40, 52)],
        "required_activities": [f"S{n:02d}-YOUDO" for n in range(40, 52)]
                              + [f"S{n:02d}-EXAM" for n in range(40, 52)],
        "required_projects": [
            "CP-N4-A", "CP-N4-B", "CP-N4-C",
            "BADGE:integrated_python_ai_capstone_integrated_mastery:synthesis",
        ],
        "critical_competencies": [
            "reproducibility_determinism", "communication_audience_tuned",
            "business_framing_judgment", "mlops_fluency",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You completed all three Phase 3 capstones (CP-N4-A, CP-N4-B, "
            "CP-N4-C — the integrator projects at the end of Phase 3 that "
            "pull together architecture decisions, LLMOps, multimodal "
            "systems, infrastructure-as-code, GPU computing, open-source "
            "practice, AI governance, data contracts, and tech leadership), "
            "passed them at the rubric floor, and wrote a synthesis "
            "document with explicit business framing, metric design, and "
            "tradeoff articulation. 'Integrated mastery' is PyArcana's "
            "curriculum-internal label for the highest cognitive-load level "
            "— it is NOT an industry title. You should NOT call yourself a "
            "'Master Engineer' or 'Senior Engineer' on the basis of this "
            "credential alone; those are job titles that depend on the "
            "company."
        ),
    },
    {
        "badge_id": "evidence_grounded_ai_systems_capstone",
        "name": "Evidence-Grounded AI Systems Capstone",
        "public_claim": (
            "The learner has completed and defended CP-FINAL — the "
            "cross-curriculum integrator capstone at S52 — at rubric "
            "performance above the provisional floor, with explicit "
            "evidence-grounded defense of every critical competency in "
            "the PyArcana stack: SQL, leakage prevention, selector "
            "resilience, type safety + production hardening, MLOps "
            "fluency, business framing, communication, and reproducibility."
        ),
        "non_claims": [
            "Does not certify the learner as any role at any seniority "
            "level, including any 'Master', 'Senior', 'Staff', "
            "'Principal', or 'Distinguished' title.",
            "The defense is against PyArcana's rubric, not against an "
            "external industry certification board.",
            "Where the curriculum has known gaps (leakage prevention, "
            "type safety, SQL performance tuning), the learner must "
            "demonstrate the competency via a supplementary independent "
            "exercise specified in the badge rubric. The credential "
            "explicitly notes which competencies were assessed via "
            "curriculum evidence vs. supplementary exercise.",
        ],
        "credential_type": "verified_credential",
        "roles_aligned": [
            "data_analyst", "data_scientist", "rpa_automation_developer",
            "ai_ml_engineer", "production_python_engineer",
        ],
        "capability_level": "integrated_mastery",
        "skill_nodes": [
            "business_framing", "oral_communication", "written_communication",
            "stakeholder_management",
        ],
        "prerequisite_badges": [
            "integrated_python_ai_capstone_integrated_mastery",
            "integrated_data_analyst_practice",
            "integrated_data_science_practice",
            "integrated_ml_engineering_practice",
            "integrated_automation_engineering_practice",
            "integrated_production_python_practice",
        ],
        "required_sections": ["S52"],
        "required_activities": ["S52-YOUDO", "S52-EXAM"],
        "required_projects": [
            "CP-FINAL",
            "BADGE:evidence_grounded_ai_systems_capstone:synthesis",
        ],
        "critical_competencies": [
            "sql_competency", "leakage_prevention", "selector_resilience",
            "type_safety_production_hardening", "mlops_fluency",
            "business_framing_judgment", "communication_audience_tuned",
            "reproducibility_determinism",
        ],
        "verification_mode": "server_verified",
        "status": "active",
        "newbie_friendly_description": (
            "You completed CP-FINAL — the cross-curriculum integrator "
            "capstone at S52 — and defended it against ALL EIGHT "
            "non-compensatory critical competencies in the PyArcana stack: "
            "SQL, leakage prevention, selector resilience, type safety + "
            "production hardening, MLOps fluency, business framing, "
            "communication, and reproducibility. 'Non-compensatory' means "
            "you cannot pass by being strong in seven and weak in one — "
            "all eight must meet the floor. This is the heaviest credential "
            "PyArcana issues. NOTE: It is NOT an industry certification "
            "(like AWS or Google Cloud certs). It is PyArcana's internal "
            "synthesis credential. NOTE: For competencies where the "
            "curriculum has gaps (leakage prevention, type safety, SQL "
            "performance tuning), you must demonstrate the competency via "
            "a supplementary independent exercise specified in the rubric."
        ),
    },
]

ALL_BADGES = PROGRESS_BADGES + APPLIED_BADGES + CROSS_SECTION_BADGES + CAPSTONE_BADGES


def assessment_blueprint_for(badge):
    is_progress = badge["credential_type"] == "local_achievement"
    is_capstone = badge["credential_type"] == "verified_credential"
    is_cross = "integrated" in badge["badge_id"] and "_practice" in badge["badge_id"]

    if is_progress:
        return {
            "components": [
                {
                    "component_id": "section_completion",
                    "description": (
                        "Each required section is marked completed when its "
                        "You Do project is submitted and its self-check is "
                        "answered. No score threshold applies; this is a "
                        "walk-through marker, not a proficiency assessment."
                    ),
                    "required_score_pct": 0,
                    "weight": 1.0,
                    "evidence_source": "progress store (localStorage + server mirror)",
                    "critical_competency": False,
                },
            ],
            "notes": (
                "Progress badges are motivational markers. They are NOT "
                "proof of proficiency and they do NOT use the provisional "
                "floors. They are eligible on the static GitHub Pages "
                "edition (local_only) and the dynamic LMS edition."
            ),
        }

    components = [
        {
            "component_id": "self_check",
            "description": (
                "Aggregate of section self-check questions across required "
                "sections. Self-checks are MCQ-only and low-authenticity; "
                "they are weighted lightly and used as a participation/"
                "engagement signal, not as a proficiency signal."
            ),
            "required_score_pct": PROVISIONAL_FLOORS["self_check_pct"],
            "weight": 0.15,
            "evidence_source": "self_check activities",
            "critical_competency": False,
        },
        {
            "component_id": "you_do_projects",
            "description": (
                "Aggregate of section You Do project rubric scores across "
                "required sections. You Do projects are independent (no "
                "step-by-step guidance) and high-authenticity; they are "
                "the primary evidence of independent capability."
            ),
            "required_score_pct": PROVISIONAL_FLOORS["you_do_pct"],
            "weight": 0.40,
            "evidence_source": "you_do activities + section rubric",
            "critical_competency": False,
        },
        {
            "component_id": "section_exams",
            "description": (
                "Aggregate of section exam scores across required sections. "
                "Exams are server-graded MCQs (pass@70 baseline); the "
                "badge floor is stricter at 85%."
            ),
            "required_score_pct": PROVISIONAL_FLOORS["section_exam_pct"],
            "weight": 0.20,
            "evidence_source": "exam activities (server-graded)",
            "critical_competency": False,
        },
        {
            "component_id": "integrator_project",
            "description": (
                "Badge-specific integrator project (independent exercise "
                "specified in the badge rubric). For applied-skill badges, "
                "this is a bounded exercise that ties together the required "
                "sections' skills. For cross-section badges, this is a "
                "synthesis project. For capstone credentials, this is the "
                "phase capstone defense plus a synthesis writeup."
            ),
            "required_score_pct": PROVISIONAL_FLOORS["integrator_project_pct"],
            "weight": 0.25 if is_cross or is_capstone else 0.20,
            "evidence_source": "badge rubric evaluation (server-verified)",
            "critical_competency": False,
        },
    ]
    if is_capstone:
        components.append({
            "component_id": "defense",
            "description": (
                "Oral or written defense of the capstone synthesis. The "
                "learner must articulate (a) the business question, "
                "(b) the design decisions and tradeoffs, (c) the "
                "competencies demonstrated, and (d) the limitations of "
                "the work. Defense is graded pass/fail with a written "
                "rubric; a fail blocks the credential."
            ),
            "required_score_pct": 100,
            "weight": 0.0,
            "evidence_source": "defense rubric (server-verified)",
            "critical_competency": True,
        })
    return {"components": components}


def scoring_rules_for(badge):
    if badge["credential_type"] == "local_achievement":
        return {
            "aggregation_method": "all_or_nothing",
            "minimum_overall_score": 0,
            "critical_competency_floor": 0,
            "non_compensatory": False,
            "rounding": "n/a",
            "notes": (
                "Progress badges do not use a numeric floor. They are "
                "issued when every required activity is marked completed "
                "in the progress store."
            ),
        }
    return {
        "aggregation_method": "weighted_average_with_non_compensatory_gates",
        "minimum_overall_score": PROVISIONAL_FLOORS["minimum_overall_pct"],
        "critical_competency_floor": PROVISIONAL_FLOORS["critical_competency_pct"],
        "non_compensatory": True,
        "rounding": "down",
        "gates": [
            {
                "gate_id": "per_component_floor",
                "description": (
                    "Each scored component must meet its own "
                    "required_score_pct. A single component below floor "
                    "blocks the badge, regardless of the weighted average."
                ),
            },
            {
                "gate_id": "critical_competency_floor",
                "description": (
                    "Each critical_competency in the badge must be "
                    "individually scored at 100% (full rubric credit). "
                    "Critical competencies are non-compensatory: strength "
                    "elsewhere cannot offset a critical-competency gap."
                ),
            },
            {
                "gate_id": "overall_floor",
                "description": (
                    "Even when every component and every critical "
                    "competency passes its floor, the weighted average "
                    "must still meet the minimum_overall_score."
                ),
            },
        ],
    }


def retake_rules_for(badge):
    if badge["credential_type"] == "local_achievement":
        return {
            "retake_policy": "n/a (no assessment to retake)",
            "cool_down_days": 0,
            "max_attempts_per_window": None,
            "window_days": None,
            "notes": "Progress badges have no retake; they update continuously as activities are completed.",
        }
    if badge["credential_type"] == "verified_credential":
        return {
            "retake_policy": (
                "If the badge is failed, the learner may retake the "
                "integrator project and defense after a cool-down period. "
                "Section exams follow the existing per-section max-3-"
                "attempts rule. You Do project rubric may be re-evaluated "
                "after a substantive revision (git diff non-empty)."
            ),
            "cool_down_days": 14,
            "max_attempts_per_window": 2,
            "window_days": 90,
            "notes": (
                "Capstone credentials are server-verified; retakes are "
                "logged server-side and visible to the learner's record. "
                "Three consecutive failed defenses trigger a mandatory "
                "mentor-review step before the next attempt."
            ),
        }
    return {
        "retake_policy": (
            "If the badge is failed, the learner may retake the failed "
            "component(s) after a cool-down period. Section exams follow "
            "the existing per-section max-3-attempts rule. You Do project "
            "rubric may be re-evaluated after a substantive revision. The "
            "integrator project may be re-submitted after revision."
        ),
        "cool_down_days": 7,
        "max_attempts_per_window": 3,
        "window_days": 90,
        "notes": (
            "Competency badge retakes are server-logged. Repeated "
            "critical-competency failures trigger a recommendation (not "
            "a hard block) to revisit the corresponding section(s)."
        ),
    }


def evidence_rules_for(badge):
    if badge["credential_type"] == "local_achievement":
        return {
            "evidence_source": "progress store only",
            "independent_work_required": False,
            "rubric_required": False,
            "server_verification_required": False,
            "acceptable_evidence": [
                "Section marked completed in progress store",
                "You Do project submitted (any rubric outcome)",
                "Self-check answered (any score)",
                "Exam attempt recorded (any score >=0%)",
            ],
            "unacceptable_evidence": [
                "Theory block read (passive consumption, not evidence)",
                "I Do demo watched (passive consumption, not evidence)",
                "We Do exercise completed (guided, not independent)",
            ],
            "legacy_progress_policy": (
                "Legacy course completion from `python-ds-progress` "
                "localStorage is accepted as section-completed evidence. "
                "Legacy completion does NOT grant any competency badge or "
                "capstone credential; it only contributes to progress_* "
                "badges."
            ),
        }
    return {
        "evidence_source": (
            "section You Do projects + section exams + badge integrator "
            "project (+ capstone defense, for verified_credential)"
        ),
        "independent_work_required": True,
        "rubric_required": True,
        "server_verification_required": (badge["verification_mode"] == "server_verified"),
        "acceptable_evidence": [
            "You Do project submitted with rubric evaluation >=80%",
            "Section exam passed with score >=85%",
            "Self-check aggregate >=85% across required sections",
            "Badge integrator project submitted with rubric evaluation >=85%",
            "(For verified_credential) Capstone defense passed at 100% "
            "rubric credit for every critical competency",
            "(For gap-affected competencies) Supplementary independent "
            "exercise completed per the badge rubric's gap-closure "
            "specification",
        ],
        "unacceptable_evidence": [
            "We Do exercise completion (guided, not independent)",
            "Theory block reading (passive)",
            "I Do demo viewing (passive)",
            "Tutorial-following without modification (tutorial-dependence "
            "is the #1 recruiter complaint; see industry_reality_brief.md §13 C1)",
            "AI-generated code without review trail (see §13 C7)",
            "Legacy course completion alone (does not fabricate missing "
            "badge evidence)",
        ],
        "gap_closure_policy": (
            "Where the curriculum has known gaps (leakage_prevention, "
            "python_type_safety, sql_performance_tuning), the badge "
            "rubric specifies a supplementary independent exercise that "
            "the learner must complete. The supplementary exercise is "
            "rubric-graded and counts toward the critical-competency "
            "floor. The badge is issued at 'pilot' status until Phase 4 "
            "closes the curriculum gap; once closed, the badge is "
            "re-issued at 'active' status without requiring existing "
            "holders to re-test (the supplementary exercise evidence is "
            "preserved as equivalent)."
        ),
    }


def expiration_policy_for(badge):
    if badge["credential_type"] == "local_achievement":
        return {
            "expires": False,
            "expiration_period_days": None,
            "renewal_policy": "n/a",
            "notes": "Progress badges never expire; they record a historical walk-through.",
        }
    if badge["credential_type"] == "competency_badge":
        return {
            "expires": True,
            "expiration_period_days": 1095,
            "renewal_policy": (
                "Renewal requires re-evaluation against the current badge "
                "rubric. If the badge has been superseded (status=superseded) "
                "or retired (status=retired) by the renewal date, the "
                "learner must earn the successor badge."
            ),
            "notes": (
                "Competency badges expire after 3 years because industry "
                "skill expectations change (see industry_reality_brief.md "
                "§15). Expiration is per-badge, not per-learner."
            ),
        }
    return {
        "expires": True,
        "expiration_period_days": 1095,
        "renewal_policy": (
            "Renewal requires re-defense against the current capstone "
            "rubric. If the curriculum has been revised, the learner "
            "may need to complete new supplementary exercises for any "
            "newly-added critical competencies."
        ),
        "notes": (
            "Capstone credentials expire after 3 years. The credential "
            "record remains visible (with an 'expired' tag) so employers "
            "can see the historical achievement; but the public_claim "
            "is no longer current until renewed."
        ),
    }


def revocation_policy_for(badge):
    return {
        "revocation_triggers": [
            "Plagiarism detected in any required activity or integrator project",
            "Critical-competency rubric found to have been gamed (e.g., "
            "test-set data used to inflate a model evaluation)",
            "Issuance error (wrong rubric applied, wrong learner record)",
            "Badge status changed to 'retired' or 'superseded' and the "
            "learner's evidence does not meet the successor badge's "
            "requirements",
            "Evidence later found to be unacceptable per evidence_rules "
            "(e.g., tutorial-clone portfolio, AI-generated code without "
            "review trail)",
        ],
        "revocation_process": (
            "Server-side revocation flips the badge record to "
            "'revoked' status. The learner is notified with the "
            "specific trigger and evidence pointer. The learner may "
            "appeal within 30 days. A revoked badge is removed from "
            "the public claim register but remains in the learner's "
            "private record with the revocation reason."
        ),
        "reinstatement_policy": (
            "After revocation for plagiarism or gaming, the learner must "
            "wait 180 days and then re-earn the badge from scratch "
            "(including all prerequisites, if applicable). After "
            "revocation for issuance error or curriculum deprecation, "
            "reinstatement is automatic once the underlying issue is "
            "resolved."
        ),
    }


def legacy_progress_policy_for(badge):
    if badge["credential_type"] == "local_achievement":
        return {
            "legacy_progress_accepted": True,
            "scope": (
                "Legacy `python-ds-progress` localStorage keys are "
                "accepted as evidence of section completion. Each "
                "legacy completed section counts toward the badge's "
                "required_sections list."
            ),
            "limitations": [
                "Legacy progress does NOT grant any competency badge or capstone credential.",
                "Legacy exam scores (pass@70) count toward progress_* badges only; "
                "they do NOT count toward competency badges or capstone credentials "
                "unless they meet the stricter 85% floor.",
                "Legacy You Do completion (if any) counts toward progress_* "
                "badges; it does NOT count toward competency badges unless "
                "re-evaluated against the current badge rubric.",
            ],
        }
    return {
        "legacy_progress_accepted": False,
        "scope": (
            "Legacy course completion does NOT fabricate missing badge "
            "evidence. Each competency badge and capstone credential "
            "requires fresh, rubric-graded evidence per the badge's "
            "evidence_rules."
        ),
        "limitations": [
            "Legacy section completion alone does not satisfy any "
            "competency badge or capstone credential requirement.",
            "Legacy exam scores >=85% MAY be carried forward as evidence "
            "for the corresponding section exam component, provided the "
            "exam questions have not been rotated. Legacy scores in the "
            "70-84% range do NOT satisfy the badge floor and require a "
            "fresh exam attempt.",
            "Legacy You Do projects MAY be carried forward as evidence "
            "ONLY if re-evaluated against the current badge rubric. "
            "Re-evaluation is mandatory; the legacy rubric outcome is "
            "not accepted as-is.",
            "Legacy capstone completion (CP-N*-X) does NOT satisfy any "
            "capstone credential defense requirement. The defense must "
            "be re-done against the current capstone credential rubric.",
        ],
        "migration_path": (
            "Learners with legacy progress receive an automatic "
            "'progress_*' badge for each phase they completed. To earn "
            "any competency badge or capstone credential, they must "
            "(a) meet the badge's prerequisite_badges chain, (b) "
            "re-evaluate their existing You Do projects against the "
            "current rubric, (c) re-take any section exam scoring below "
            "85%, and (d) complete the badge integrator project "
            "(and defense, for verified_credential). No shortcut."
        ),
    }


def market_evidence_for(badge):
    cc_evidence = {
        "sql_competency": [
            "industry_reality_brief.md §3.1 (DA auto-reject on SQL)",
            "industry_reality_brief.md §5 (DA required skills, SQL row)",
            "industry_reality_brief.md §13 C2 (weak SQL = auto-reject)",
            "industry_reality_brief.md §28.3 (SQL competency row)",
        ],
        "leakage_prevention": [
            "industry_reality_brief.md §13 C5 (data leakage = critical)",
            "industry_reality_brief.md §28.3 (leakage prevention row)",
        ],
        "selector_resilience": [
            "industry_reality_brief.md §19 (RPA failure modes)",
            "industry_reality_brief.md §28.3 (selector resilience row)",
        ],
        "type_safety_production_hardening": [
            "industry_reality_brief.md §25 (PySE frequently missing)",
            "industry_reality_brief.md §28.3 (type safety row)",
        ],
        "mlops_fluency": [
            "industry_reality_brief.md §22 (AIML frequently missing)",
            "industry_reality_brief.md §28.3 (MLOps fluency row)",
        ],
        "business_framing_judgment": [
            "industry_reality_brief.md §13 C9 (no business impact)",
            "industry_reality_brief.md §28.3 (business framing row)",
        ],
        "communication_audience_tuned": [
            "industry_reality_brief.md §13 C8 (acronyms not explained)",
            "industry_reality_brief.md §28.3 (communication row)",
        ],
        "reproducibility_determinism": [
            "industry_reality_brief.md §13 C6 (poor testing habits)",
            "industry_reality_brief.md §28.3 (reproducibility row)",
        ],
    }
    ev = []
    for cc in badge.get("critical_competencies", []):
        ev.extend(cc_evidence.get(cc, []))
    ev.append("industry_skill_graph.json#critical_competencies")
    ev.append("role_skill_taxonomy.json#design_principles")
    return sorted(set(ev))


def badge_family_for(badge):
    if badge["credential_type"] == "local_achievement":
        return "progress_achievement"
    if badge["credential_type"] == "verified_credential":
        return "capstone_credential"
    if "integrated" in badge["badge_id"] and "_practice" in badge["badge_id"]:
        return "cross_section_capability"
    return "applied_skill"


def finalize_badge(badge):
    return {
        "badge_id": badge["badge_id"],
        "version": CATALOG_VERSION,
        "name": badge["name"],
        "public_claim": badge["public_claim"],
        "non_claims": badge["non_claims"],
        "credential_type": badge["credential_type"],
        "roles_aligned": badge["roles_aligned"],
        "capability_level": badge["capability_level"],
        "market_evidence_ids": market_evidence_for(badge),
        "skill_nodes": badge["skill_nodes"],
        "prerequisite_badges": badge["prerequisite_badges"],
        "required_sections": badge["required_sections"],
        "required_activities": badge["required_activities"],
        "required_projects": badge["required_projects"],
        "critical_competencies": badge["critical_competencies"],
        "assessment_blueprint": assessment_blueprint_for(badge),
        "scoring_rules": scoring_rules_for(badge),
        "retake_rules": retake_rules_for(badge),
        "evidence_rules": evidence_rules_for(badge),
        "expiration_policy": expiration_policy_for(badge),
        "revocation_policy": revocation_policy_for(badge),
        "legacy_progress_policy": legacy_progress_policy_for(badge),
        "verification_mode": badge["verification_mode"],
        "issuer": ISSUER,
        "status": badge["status"],
        "newbie_friendly_description": badge["newbie_friendly_description"],
        "family": badge_family_for(badge),
    }


CATALOG_BADGES = [finalize_badge(b) for b in ALL_BADGES]


def build_dependency_graph():
    edges = []
    for b in CATALOG_BADGES:
        for prereq in b["prerequisite_badges"]:
            edges.append({
                "from_badge_id": prereq,
                "to_badge_id": b["badge_id"],
                "edge_type": "prerequisite",
                "strict": True,
                "description": (
                    f"Learner must hold `{prereq}` before `{b['badge_id']}` "
                    f"can be issued."
                ),
            })
    for b in CATALOG_BADGES:
        if b["status"] == "pilot":
            edges.append({
                "from_badge_id": b["badge_id"],
                "to_badge_id": b["badge_id"],
                "edge_type": "pending_upgrade",
                "strict": False,
                "description": (
                    f"Pilot badge will be upgraded to `active` status when "
                    f"Phase 4 closes the curriculum gap(s) noted in the "
                    f"badge's non_claims. Holders do not need to re-test; "
                    f"supplementary exercise evidence is preserved as "
                    f"equivalent."
                ),
            })
    levels = {}
    pending = {b["badge_id"]: set(b["prerequisite_badges"]) for b in CATALOG_BADGES}
    level = 0
    while pending:
        this_level = [bid for bid, deps in pending.items() if not deps]
        if not this_level:
            raise RuntimeError(f"Cycle detected in badge dependency graph: {pending}")
        for bid in this_level:
            levels[bid] = level
            del pending[bid]
        for bid in pending:
            pending[bid] -= set(this_level)
        level += 1
    return {
        "version": CATALOG_VERSION,
        "generated_at": NOW,
        "generated_by": "badge_architect node (Phase 6)",
        "badge_count": len(CATALOG_BADGES),
        "edge_count": len(edges),
        "nodes": [
            {
                "badge_id": b["badge_id"],
                "name": b["name"],
                "family": b["family"],
                "credential_type": b["credential_type"],
                "capability_level": b["capability_level"],
                "prerequisite_badges": b["prerequisite_badges"],
                "topological_level": levels[b["badge_id"]],
                "status": b["status"],
            }
            for b in CATALOG_BADGES
        ],
        "edges": edges,
    }


def requirement_markdown(badge):
    lines = []
    p = lambda s="": lines.append(s)
    p(f"# Badge Requirements — {badge['name']}")
    p("")
    p(f"**Badge ID:** `{badge['badge_id']}`  ")
    p(f"**Version:** {badge['version']}  ")
    p(f"**Family:** {badge['family']}  ")
    p(f"**Credential type:** `{badge['credential_type']}`  ")
    p(f"**Capability level:** `{badge['capability_level']}`  ")
    p(f"**Verification mode:** `{badge['verification_mode']}`  ")
    p(f"**Status:** `{badge['status']}`  ")
    p(f"**Issuer:** {badge['issuer']}  ")
    p(f"**Generated:** {NOW}")
    p("")
    p("## Public claim")
    p("")
    p(f"> {badge['public_claim']}")
    p("")
    p("## Non-claims (what this badge does NOT say)")
    p("")
    for nc in badge["non_claims"]:
        p(f"- {nc}")
    p("")
    p("## Newbie-friendly description (Stephen Fry redaction)")
    p("")
    p(f"> {badge['newbie_friendly_description']}")
    p("")
    p("## Roles aligned")
    p("")
    for r in badge["roles_aligned"]:
        p(f"- `{r}`")
    p("")
    p("## Skill nodes (evidence-backed)")
    p("")
    if badge["skill_nodes"]:
        for s in badge["skill_nodes"]:
            p(f"- `{s}`")
    else:
        p("- _(none — this badge records walk-through only, not skill evidence)_")
    p("")
    p("## Critical competencies (non-compensatory)")
    p("")
    if badge["critical_competencies"]:
        for cc in badge["critical_competencies"]:
            p(f"- `{cc}` — assessed at 100% floor; cannot be offset by strength elsewhere")
    else:
        p("- _(none — progress badge; no critical competencies assessed)_")
    p("")
    p("## Market evidence pointers")
    p("")
    for ev in badge["market_evidence_ids"]:
        p(f"- `{ev}`")
    p("")
    p("## Prerequisite badges")
    p("")
    if badge["prerequisite_badges"]:
        for pb in badge["prerequisite_badges"]:
            p(f"- `{pb}`")
    else:
        p("- _(none — this is an entry-point badge)_")
    p("")
    p("## Required sections")
    p("")
    p(", ".join(f"`{s}`" for s in badge["required_sections"]))
    p("")
    p("## Required activities")
    p("")
    for a in badge["required_activities"]:
        p(f"- `{a}`")
    p("")
    p("## Required projects")
    p("")
    for proj in badge["required_projects"]:
        p(f"- `{proj}`")
    p("")
    p("## Assessment blueprint")
    p("")
    p("```json")
    p(json.dumps(badge["assessment_blueprint"], indent=2))
    p("```")
    p("")
    p("## Scoring rules")
    p("")
    p("```json")
    p(json.dumps(badge["scoring_rules"], indent=2))
    p("```")
    p("")
    p("## Retake rules")
    p("")
    p("```json")
    p(json.dumps(badge["retake_rules"], indent=2))
    p("```")
    p("")
    p("## Evidence rules")
    p("")
    p("```json")
    p(json.dumps(badge["evidence_rules"], indent=2))
    p("```")
    p("")
    p("## Expiration policy")
    p("")
    p("```json")
    p(json.dumps(badge["expiration_policy"], indent=2))
    p("```")
    p("")
    p("## Revocation policy")
    p("")
    p("```json")
    p(json.dumps(badge["revocation_policy"], indent=2))
    p("```")
    p("")
    p("## Legacy progress policy")
    p("")
    p("```json")
    p(json.dumps(badge["legacy_progress_policy"], indent=2))
    p("```")
    p("")
    p("## Integrator project specification")
    p("")
    p(integrator_project_spec(badge))
    p("")
    p("## Critical-competency rubric specifications")
    p("")
    p(critical_competency_rubric_spec(badge))
    p("")
    return "\n".join(lines) + "\n"


def integrator_project_spec(badge):
    bid = badge["badge_id"]
    if badge["credential_type"] == "local_achievement":
        return (
            "_No integrator project for progress badges. The badge is "
            "issued automatically when all required activities are marked "
            "completed in the progress store._"
        )
    if "capstone" in bid:
        cps = [p for p in badge["required_projects"] if p.startswith("CP-")]
        prereqs = ", ".join(f"`{p}`" for p in badge["prerequisite_badges"])
        return dedent(f"""\
            The integrator project for this capstone credential is the
            **synthesis defense** specified in
            `BADGE:{bid}:synthesis`. The learner must:

            1. Complete every required phase capstone project
               ({', '.join(f'`{p}`' for p in cps)}).
            2. Write a synthesis document (1,500-3,000 words) that:
               - States the business question each capstone answers.
               - Articulates the design decisions and tradeoffs made in each.
               - Identifies the critical competencies demonstrated and
                 provides a pointer to the rubric evidence for each.
               - Names the limitations of the work and what would be
                 needed to address them.
            3. Defend the synthesis in a 30-minute oral review (or
               equivalent async written review) with a PyArcana reviewer
               or designated industry mentor. The defense is graded
               pass/fail against the defense rubric in
               `badge_rubrics/{bid}.json#defense_rubric`.

            The synthesis document and defense recording are stored
            server-side and linked to the learner's credential record.

            Prerequisites for this credential: {prereqs}.
        """)
    if "integrated" in bid and "_practice" in bid:
        prereqs = ", ".join(f"`{p}`" for p in badge["prerequisite_badges"])
        return dedent(f"""\
            The integrator project for this cross-section capability
            badge is `BADGE:{bid}:integrator`. The learner must:

            1. Hold every prerequisite applied-skill badge
               ({prereqs}).
            2. Build an independent synthesis project that demonstrates
               every skill_node listed in the badge. The project scope
               is: a single end-to-end artifact (notebook, repo, or
               deployed service) that exercises every required section's
               primary skill. The artifact must NOT be a tutorial-clone
               (industry_reality_brief.md §13 C10).
            3. Submit a project README that states:
               - The business question and stakeholder.
               - The design decisions and tradeoffs (>=2 documented options
                 per major decision).
               - The reproducibility instructions (README + requirements
                 + deterministic seed + `make` or `just` commands).
               - The audience-tuned 1-pager (separate file) for a
                 non-technical PM.
            4. Submit to a server-side rubric evaluation per
               `badge_rubrics/{bid}.json#integrator_rubric`.

            The project is rubric-graded; minimum 85% overall, 100% on
            every critical competency.
        """)
    prereqs = ", ".join(f"`{p}`" for p in badge["prerequisite_badges"]) if badge["prerequisite_badges"] else "none — entry-point badge"
    return dedent(f"""\
        The integrator project for this applied-skill badge is
        `BADGE:{bid}:integrator`. The learner must:

        1. Hold every prerequisite badge
           ({prereqs}).
        2. Complete every required section's You Do project and section
           exam at or above the provisional floor
           (You Do >=80%, exam >=85%, self-check >=85%).
        3. Complete a bounded independent exercise that ties together
           the required sections' primary skills. The exercise
           specification is in `badge_rubrics/{bid}.json#integrator_spec`.
           The exercise is bounded (estimated 4-8 hours of independent
           work) and is rubric-graded.

        The exercise is NOT a tutorial-following; it is independent work
        that demonstrates the learner can apply the badge's skills
        without step-by-step guidance.
    """)


def critical_competency_rubric_spec(badge):
    if not badge["critical_competencies"]:
        return (
            "_No critical competencies for this badge. See scoring_rules "
            "for the per-component and overall floors._"
        )
    lines = [
        "Each critical competency is graded against a 4-criterion rubric. "
        "All four criteria must score 100% (full credit) for the "
        "competency to pass. Critical competencies are non-compensatory: "
        "a single failing criterion blocks the badge.",
        "",
    ]
    for cc in badge["critical_competencies"]:
        lines.append(f"### `{cc}`")
        lines.append("")
        lines.append(cc_rubric_text(cc, badge))
        lines.append("")
    return "\n".join(lines)


def cc_rubric_text(cc_id, badge):
    specs = {
        "sql_competency": dedent("""\
            **Skill scope:** `sql_fundamentals`, `sql_window_ctes`,
            `sql_performance_tuning`.

            **Note:** `sql_performance_tuning` is a known curriculum
            gap (Phase 3 §7). Until Phase 4 closes the gap, the
            learner must complete the supplementary exercise specified
            in `badge_rubrics/<id>.json#gap_closure_sql_performance_tuning`.

            **Rubric criteria (each must score 100%):**
            1. **Query correctness** — every submitted query returns the
               intended result on the test database. Partial results
               count as failure.
            2. **Idiomatic SQL** — uses window functions and CTEs where
               they improve readability; does not use correlated
               subqueries where a JOIN or window function would be clearer.
            3. **Schema awareness** — query references the correct
               columns and tables; understands primary/foreign key
               relationships.
            4. **Performance reasoning** — for `sql_performance_tuning`
               only: can read a query plan, identify the bottleneck, and
               propose an index or rewrite. (This criterion is assessed
               via the supplementary exercise until the curriculum gap
               is closed.)
        """),
        "leakage_prevention": dedent("""\
            **Skill scope:** `leakage_prevention`, `model_evaluation`.

            **Note:** `leakage_prevention` is a known curriculum gap
            (Phase 3 §7). Until Phase 4 closes the gap, the learner
            must complete the supplementary exercise specified in
            `badge_rubrics/<id>.json#gap_closure_leakage_prevention`.

            **Rubric criteria (each must score 100%):**
            1. **Train/test split discipline** — split is performed
               before any feature engineering that uses target-derived
               statistics; group-aware splitting when groups exist; time-
               aware splitting for time series.
            2. **Target leakage audit** — the learner articulates, for
               every feature, whether it could leak the target. Features
               derived from the target are removed or correctly isolated.
            3. **Preprocessing pipeline integrity** — all preprocessing
               (scaling, imputation, encoding) is fit on the training
               set only and applied via a fitted pipeline; no fit-on-full-
               data shortcuts.
            4. **Evaluation honesty** — the learner reports a relevant
               baseline, the chosen metric with rationale, and an honest
               error analysis; does not cherry-pick a favorable metric.
        """),
        "selector_resilience": dedent("""\
            **Skill scope:** `selector_design`, `exception_handling_rpa`,
            `reframework`.

            **Note:** `reframework` is a known curriculum gap (Phase 3 §7).
            PyArcana's RPA track is Python-based by design and does not
            teach UiPath REFramework. The selector_resilience competency
            is therefore assessed on Python-based selectors
            (Playwright/Selenium) with explicit acknowledgment that
            REFramework is out-of-current-scope.

            **Rubric criteria (each must score 100%):**
            1. **Stable selector choice** — selectors use stable
               attributes (data-test, ID, ARIA role) over brittle ones
               (nth-child, position-based).
            2. **Anchor strategy** — when no stable selector exists,
               learner uses anchor-based location (find a stable nearby
               element, then walk to the target).
            3. **Exception handling** — every UI interaction is wrapped
               in try/except with a defined recovery (retry, fallback,
               or fail-closed exit).
            4. **UI-change resilience test** — learner demonstrates the
               bot survives a documented UI change (before/after
               screenshots + selector strategy memo).
        """),
        "type_safety_production_hardening": dedent("""\
            **Skill scope:** `python_type_safety`, `observability`,
            `ci_cd`, `packaging_reproducibility`.

            **Note:** `python_type_safety` is a known curriculum gap
            (Phase 3 §7). Until Phase 4 closes the gap, the learner
            must complete the supplementary exercise specified in
            `badge_rubrics/<id>.json#gap_closure_python_type_safety`.

            **Rubric criteria (each must score 100%):**
            1. **Type annotations** — all function signatures and class
               attributes are type-annotated; no `# type: ignore` without
               a justification comment.
            2. **mypy/Pyright baseline** — `pyproject.toml` has a mypy
               or Pyright config; CI runs the type-checker as a gate;
               the codebase passes clean.
            3. **Observability** — structured logs (JSON), OpenTelemetry
               tracing, Prometheus metrics; all present in the
               submitted artifact.
            4. **CI/CD gate** — CI pipeline runs tests, type-checker,
               and linter on every push; deployment is gated on all
               three passing.
        """),
        "mlops_fluency": dedent("""\
            **Skill scope:** `model_deployment`, `mlops_pipelines`,
            `drift_monitoring`, `system_design`.

            **Rubric criteria (each must score 100%):**
            1. **Deployment artifact** — model is served behind a
               containerized API with health check and latency budget;
               not just a `.pkl` file.
            2. **Pipeline reproducibility** — retraining pipeline is
               code (not click-ops); runs end-to-end from a single
               command; deterministic seeds; pinned dependencies.
            3. **Drift monitoring** — learner articulates data drift,
               concept drift, and target drift; wires at least one into
               a retraining trigger or alert.
            4. **System design memo** — learner writes a 1-page design
               memo identifying the system's SLOs, failure modes, and
               rollback plan.
        """),
        "business_framing_judgment": dedent("""\
            **Skill scope:** `business_framing`, `metric_design`,
            `tradeoff_articulation`.

            **Rubric criteria (each must score 100%):**
            1. **Business question** — README or writeup states the
               business question, the stakeholder, and the decision the
               work supports.
            2. **Metric design** — the chosen metric matches the
               business question (not just accuracy); the learner
               articulates why this metric and not another.
            3. **Tradeoff articulation** — at least two options are
               documented per major decision, with pros, cons, the
               chosen option, and the conditions under which to revisit.
            4. **Impact framing** — the work is framed in dollar/impact
               terms (revenue, cost, time saved, risk reduced), not just
               technical terms.
        """),
        "communication_audience_tuned": dedent("""\
            **Skill scope:** `written_communication`, `oral_communication`,
            `stakeholder_translation`.

            **Rubric criteria (each must score 100%):**
            1. **Written artifact** — a 1-pager that a non-technical PM
               can act on: question, finding, recommendation, caveat,
               next step.
            2. **Audience tuning** — separate artifacts (or sections)
               for technical vs. non-technical audiences; jargon is
               explained inline on first use.
            3. **Oral defense** (for verified_credential only) — a
               recorded 5-minute presentation, audience-tuned, with
               slides.
            4. **Stakeholder translation** — the learner articulates,
               for at least one technical finding, the corresponding
               business implication and recommended action.
        """),
        "reproducibility_determinism": dedent("""\
            **Skill scope:** `packaging_reproducibility`, `git_workflow`,
            `testing_discipline`.

            **Rubric criteria (each must score 100%):**
            1. **Reproducible environment** — `pyproject.toml` or
               `requirements.txt` with pinned versions; README
               instructions for setting up the environment from
               scratch.
            2. **Deterministic seeds** — all randomness (NumPy,
               PyTorch, scikit-learn, hash seeds) is seeded; rerunning
               the pipeline produces the same output.
            3. **Git hygiene** — commit history is clean (no force-
               pushes mid-project); branches are used for features;
               PRs are used for merges.
            4. **Testing discipline** — at least one unit test per
               transformation function; tests run in CI; coverage
               reported (target >=70%, not gated at this level).
        """),
    }
    return specs.get(cc_id, f"_(rubric spec missing for `{cc_id}`)_")


def rubric_json(badge):
    bid = badge["badge_id"]
    rubric = {
        "badge_id": bid,
        "version": CATALOG_VERSION,
        "generated_at": NOW,
        "generated_by": "badge_architect node (Phase 6)",
        "provisional_floors": PROVISIONAL_FLOORS,
        "components": badge["assessment_blueprint"]["components"],
        "scoring_rules": badge["scoring_rules"],
    }
    if badge["credential_type"] == "local_achievement":
        rubric["integrator_spec"] = None
        rubric["critical_competency_rubrics"] = {}
        rubric["gap_closure_exercises"] = {}
        return rubric
    rubric["integrator_spec"] = integrator_spec_json(badge)
    rubric["critical_competency_rubrics"] = cc_rubric_json(badge)
    rubric["gap_closure_exercises"] = gap_closure_json(badge)
    if badge["credential_type"] == "verified_credential":
        rubric["defense_rubric"] = defense_rubric_json(badge)
    return rubric


def integrator_spec_json(badge):
    bid = badge["badge_id"]
    if "capstone" in bid:
        return {
            "project_id": f"BADGE:{bid}:synthesis",
            "project_type": "synthesis_defense",
            "estimated_hours": 8,
            "deliverables": [
                "Synthesis document (1,500-3,000 words) covering every required capstone",
                "Oral defense recording (30 min) or async written review",
                "Critical-competency evidence map (one pointer per competency)",
            ],
            "rubric_criteria": [
                {"criterion_id": "synthesis_breadth", "description": "Synthesis covers every required capstone.", "weight": 0.20, "floor_pct": 85},
                {"criterion_id": "business_framing", "description": "Each capstone is framed against a business question.", "weight": 0.20, "floor_pct": 85},
                {"criterion_id": "tradeoff_articulation", "description": ">=2 documented options per major decision.", "weight": 0.20, "floor_pct": 85},
                {"criterion_id": "competency_evidence_map", "description": "Every critical competency has a pointer to rubric evidence.", "weight": 0.20, "floor_pct": 100},
                {"criterion_id": "limitations_honesty", "description": "Limitations are named with a path to address them.", "weight": 0.10, "floor_pct": 85},
                {"criterion_id": "defense_quality", "description": "Oral defense demonstrates live recall, not reading.", "weight": 0.10, "floor_pct": 85},
            ],
            "minimum_overall_pct": 85,
            "non_compensatory": True,
        }
    if "integrated" in bid and "_practice" in bid:
        return {
            "project_id": f"BADGE:{bid}:integrator",
            "project_type": "independent_synthesis",
            "estimated_hours": 20,
            "deliverables": [
                "Single end-to-end artifact (notebook, repo, or deployed service)",
                "Project README with business framing, design decisions, tradeoffs",
                "Reproducibility instructions (requirements + seed + make/just)",
                "Audience-tuned 1-pager for a non-technical PM",
            ],
            "rubric_criteria": [
                {"criterion_id": "scope_breadth", "description": "Artifact exercises every required skill_node.", "weight": 0.20, "floor_pct": 85},
                {"criterion_id": "independence", "description": "No tutorial-clone; learner-built from a blank slate.", "weight": 0.15, "floor_pct": 85},
                {"criterion_id": "business_framing", "description": "Business question and stakeholder explicit.", "weight": 0.15, "floor_pct": 85},
                {"criterion_id": "tradeoff_articulation", "description": ">=2 documented options per major decision.", "weight": 0.10, "floor_pct": 85},
                {"criterion_id": "reproducibility", "description": "Pipeline runs end-to-end from a single command on a clean machine.", "weight": 0.15, "floor_pct": 85},
                {"criterion_id": "audience_tuning", "description": "1-pager is action-ready for a non-technical PM.", "weight": 0.10, "floor_pct": 85},
                {"criterion_id": "critical_competency_pass", "description": "Every critical competency passes its 100% floor.", "weight": 0.15, "floor_pct": 100},
            ],
            "minimum_overall_pct": 85,
            "non_compensatory": True,
        }
    return {
        "project_id": f"BADGE:{bid}:integrator",
        "project_type": "bounded_independent_exercise",
        "estimated_hours": 6,
        "deliverables": [
            "Bounded exercise artifact (notebook, script, or repo) per the badge's exercise prompt",
            "Short README (<=500 words) explaining the approach and tradeoffs",
            "Test(s) demonstrating the artifact works as claimed",
        ],
        "rubric_criteria": [
            {"criterion_id": "exercise_completion", "description": "Exercise prompt fully addressed; no missing parts.", "weight": 0.30, "floor_pct": 85},
            {"criterion_id": "independence", "description": "No tutorial-clone; learner built the solution.", "weight": 0.20, "floor_pct": 85},
            {"criterion_id": "skill_application", "description": "Every required skill_node is exercised in the artifact.", "weight": 0.25, "floor_pct": 85},
            {"criterion_id": "reproducibility", "description": "Artifact runs from a single command; dependencies pinned.", "weight": 0.15, "floor_pct": 85},
            {"criterion_id": "critical_competency_pass", "description": "Every critical competency passes its 100% floor.", "weight": 0.10, "floor_pct": 100},
        ],
        "minimum_overall_pct": 85,
        "non_compensatory": True,
    }


def cc_rubric_json(badge):
    out = {}
    for cc in badge["critical_competencies"]:
        out[cc] = {
            "floor_pct": 100,
            "non_compensatory": True,
            "criteria": [
                {"criterion_id": f"{cc}_criterion_1", "description": "See badge_requirements/<id>.md for full text.", "weight": 0.25, "floor_pct": 100},
                {"criterion_id": f"{cc}_criterion_2", "description": "See badge_requirements/<id>.md for full text.", "weight": 0.25, "floor_pct": 100},
                {"criterion_id": f"{cc}_criterion_3", "description": "See badge_requirements/<id>.md for full text.", "weight": 0.25, "floor_pct": 100},
                {"criterion_id": f"{cc}_criterion_4", "description": "See badge_requirements/<id>.md for full text.", "weight": 0.25, "floor_pct": 100},
            ],
        }
    return out


def gap_closure_json(badge):
    """For each critical competency backed by a known curriculum gap,
    specify the supplementary exercise. References the Phase 4 gap IDs
    in `curriculum_gap_matrix.json` for traceability."""
    gaps = {
        "leakage_prevention": {
            "gap_skill_node": "leakage_prevention",
            "gap_source": "curriculum_skill_graph.json#summary.skill_node_coverage.uncovered_skills",
            "phase4_gap_id": "GAP-P0-001",
            "phase4_gap_url": "industry_alignment/curriculum_gap_matrix.md#gap-p0-001--leakage_prevention-never-taught-as-a-named-assessed-skill",
            "supplementary_exercise_id": "gap_closure_leakage_prevention",
            "exercise_prompt": (
                "Identify a public ML tutorial notebook (Kaggle, GitHub, "
                "Medium). Audit it for data leakage: target leakage, "
                "train-test contamination, group leakage, time-series "
                "leakage, label leakage. Write a 500-word memo naming "
                "each leak found, the fix, and re-running the "
                "evaluation with the fix applied. Submit the original "
                "notebook, your fork with fixes, and the memo."
            ),
            "estimated_hours": 6,
            "rubric_floor_pct": 100,
        },
        "type_safety_production_hardening": {
            "gap_skill_node": "python_type_safety",
            "gap_source": "curriculum_skill_graph.json#summary.skill_node_coverage.uncovered_skills",
            "phase4_gap_id": "GAP-P0-002",
            "phase4_gap_url": "industry_alignment/curriculum_gap_matrix.md#gap-p0-002--python_type_safety-mypypyright-discipline-never-taught-as-a-named-assessed-skill",
            "supplementary_exercise_id": "gap_closure_python_type_safety",
            "exercise_prompt": (
                "Take a Python project (your own, or a public one with "
                "permission). Add type annotations to every function "
                "signature and class attribute. Configure mypy or "
                "Pyright in `pyproject.toml`. Add a CI step that runs "
                "the type-checker as a gate. Submit the diff, the "
                "config, and a 200-word writeup of the type errors "
                "you caught and fixed."
            ),
            "estimated_hours": 6,
            "rubric_floor_pct": 100,
        },
        "sql_competency": {
            "gap_skill_node": "sql_performance_tuning",
            "gap_source": "curriculum_skill_graph.json#summary.skill_node_coverage.uncovered_skills",
            "phase4_gap_id": "GAP-P0-003",
            "phase4_gap_url": "industry_alignment/curriculum_gap_matrix.md#gap-p0-003--sql_performance_tuning-never-taught-sql-critical-competency-is-partial",
            "supplementary_exercise_id": "gap_closure_sql_performance_tuning",
            "exercise_prompt": (
                "Take a slow SQL query (your own, or from a public "
                "Postgres/MySQL tutorial). Run EXPLAIN ANALYZE. "
                "Identify the bottleneck (seq scan, nested loop, missing "
                "index). Propose and apply a fix (index, rewrite, "
                "materialization). Re-run EXPLAIN ANALYZE to demonstrate "
                "the improvement. Submit the before/after query plans, "
                "the fix, and a 300-word memo explaining the reasoning."
            ),
            "estimated_hours": 4,
            "rubric_floor_pct": 100,
        },
        "selector_resilience": {
            "gap_skill_node": "reframework",
            "gap_source": "curriculum_skill_graph.json#summary.skill_node_coverage.uncovered_skills",
            "phase4_gap_id": "GAP-P0-004",
            "phase4_gap_url": "industry_alignment/curriculum_gap_matrix.md#gap-p0-004--reframework-state-machine--dispatcherperformer-pattern-never-taught-rpa-selector_resilience-competency-is-partial",
            "supplementary_exercise_id": "gap_closure_reframework",
            "exercise_prompt": (
                "PyArcana's RPA track is Python-based by design; "
                "UiPath REFramework is out-of-current-scope. To "
                "demonstrate the durable state-machine + dispatcher/"
                "performer pattern that REFramework codifies, the "
                "learner must build a Python-based bot using a "
                "state-machine library (e.g., `transitions`, "
                "`python-statemachine`, or a hand-rolled FSM) with a "
                "queue-backed dispatcher/performer split (SQLite or "
                "Redis), exception recovery, and a documented UI-"
                "change resilience test. Submit the bot, the state "
                "diagram, and the resilience memo."
            ),
            "estimated_hours": 8,
            "rubric_floor_pct": 100,
            "note": (
                "This supplementary exercise is OPTIONAL for the "
                "`selector_resilience` competency because PyArcana's "
                "RPA track is explicitly Python-based and REFramework "
                "is out-of-scope by design (see industry_reality_brief.md "
                "§19, §20, and curriculum_gap_matrix.md §1a). The "
                "competency is assessed on the durable Python-based "
                "selector + exception-handling principles, which ARE "
                "in the curriculum. The supplementary exercise is "
                "required only if the learner wishes to also assert "
                "REFramework-equivalent (vendor-RPA) competency."
            ),
        },
    }
    out = {}
    for cc in badge["critical_competencies"]:
        if cc in gaps:
            out[cc] = gaps[cc]
    return out


def defense_rubric_json(badge):
    return {
        "defense_format": "30 min oral or async written review",
        "reviewer": "PyArcana reviewer or designated industry mentor",
        "rubric_criteria": [
            {"criterion_id": "business_framing_recall", "description": "Learner articulates the business question and stakeholder without prompting.", "weight": 0.20, "floor_pct": 100},
            {"criterion_id": "design_decision_recall", "description": "Learner articulates the major design decisions and tradeoffs without reading from notes.", "weight": 0.20, "floor_pct": 100},
            {"criterion_id": "competency_evidence_recall", "description": "For every critical competency, learner points to specific evidence in the synthesis artifact.", "weight": 0.20, "floor_pct": 100},
            {"criterion_id": "limitations_honesty", "description": "Learner names the limitations of the work without prompting.", "weight": 0.15, "floor_pct": 100},
            {"criterion_id": "audience_tuning", "description": "Learner adjusts explanation level when reviewer asks for a non-technical version.", "weight": 0.15, "floor_pct": 100},
            {"criterion_id": "live_question_handling", "description": "Learner handles at least one unscripted question without deflecting.", "weight": 0.10, "floor_pct": 100},
        ],
        "minimum_overall_pct": 100,
        "non_compensatory": True,
        "notes": (
            "The defense is graded pass/fail. A single criterion below "
            "floor blocks the credential. The defense recording is "
            "stored server-side and linked to the learner's credential "
            "record."
        ),
    }


def claim_register_markdown():
    lines = []
    p = lambda s="": lines.append(s)
    p("# Badge Claim Register")
    p("")
    p(f"**Generated:** {NOW}  ")
    p(f"**Catalog version:** {CATALOG_VERSION}  ")
    p(f"**Badge count:** {len(CATALOG_BADGES)}  ")
    p(f"**Issuer:** {ISSUER}")
    p("")
    p("## Purpose")
    p("")
    p(dedent("""\
        This register is the public, learner-and-employer-facing list of
        every claim PyArcana badges make — and, just as importantly, every
        claim they explicitly do NOT make.

        Each entry has:

        - **Public claim** — what the badge certifies, in plain language.
        - **Non-claims** — what the badge does NOT certify, listed
          explicitly so learners cannot over-claim and employers cannot
          over-infer.
        - **Capability level** — a curriculum-internal label
          (`foundation`, `independent_practitioner`, `advanced_applied`,
          `integrated_mastery`) that describes cognitive load, NOT
          industry seniority.
        - **Verification mode** — `local_only` (motivational marker) vs.
          `server_verified` (cryptographic issuance).

        The register is the canonical public artifact. If a badge's claim
        is not in this register, the badge does not make that claim.
    """))
    p("")
    p("## How to read capability levels")
    p("")
    p(dedent("""\
        PyArcana's capability levels describe the **cognitive load** of
        the work assessed, not industry seniority:

        | Level | Meaning | What it is NOT |
        |---|---|---|
        | `foundation` | Can apply with guidance; follows instructions; works within a pre-scoped problem. | NOT 'Junior' or 'Entry-level'. |
        | `independent_practitioner` | Can apply independently within a pre-scoped problem; recognizes common failure modes. | NOT 'Mid-level' or 'Senior'. |
        | `advanced_applied` | Can diagnose and design within an existing system; articulates tradeoffs. | NOT 'Senior', 'Staff', or 'Lead'. |
        | `integrated_mastery` | Can integrate multiple specialization areas into a single defended synthesis. | NOT 'Principal', 'Staff', 'Distinguished', or 'Master'. |

        These labels are PyArcana-internal. They MUST NOT be used as
        industry seniority titles on a resume, LinkedIn profile, or job
        application. Doing so is a misrepresentation of the credential
        and may trigger revocation per the badge's revocation_policy.
    """))
    p("")
    p("## Family 1 — Progress achievements (local_achievement)")
    p("")
    p(dedent("""\
        Motivational markers. NOT proof of proficiency. Issued on both
        the static GitHub Pages edition (local) and the dynamic LMS
        edition (server-mirrored). Never expire.
    """))
    p("")
    _claim_register_section(lines, "progress_achievement")
    p("## Family 2 — Applied-skill badges (competency_badge)")
    p("")
    p(dedent("""\
        Narrow, evidence-based badges proving a bounded skill bundle
        through independent work. Server-verified issuance on the
        dynamic LMS edition; eligibility preview only on the static
        GitHub Pages edition. Expire after 3 years.
    """))
    p("")
    _claim_register_section(lines, "applied_skill")
    p("## Family 3 — Cross-section capability badges (competency_badge)")
    p("")
    p(dedent("""\
        Synthesis badges requiring multiple sections' skills plus an
        integrated project. Server-verified only. Expire after 3 years.
    """))
    p("")
    _claim_register_section(lines, "cross_section_capability")
    p("## Family 4 — Capstone credentials (verified_credential)")
    p("")
    p(dedent("""\
        Broadest credentials requiring synthesis, practical artifacts,
        rubric performance, and explicit defense. Server-verified only.
        Expire after 3 years.
    """))
    p("")
    _claim_register_section(lines, "capstone_credential")
    p("## Naming-convention audit")
    p("")
    p(dedent("""\
        Every badge name in this register has been audited against the
        specification's acceptable patterns:

        - Python Data Foundations (used as `python_data_foundations`)
        - Independent Data Preparation (used as `independent_data_preparation`)
        - Applied Analytical Reasoning (used as `applied_analytical_reasoning`)
        - Reliable Automation Development (used as `reliable_automation_development`)
        - Responsible Machine Learning Evaluation (used as `responsible_machine_learning_evaluation`)
        - Production ML Delivery Foundations (used as `production_python_delivery_foundations`,
          modified with 'Python' to disambiguate from the Phase-2 MLOps
          badges; the spec's exact phrase is preserved as a sub-string)
        - Evidence-Grounded AI Systems (used in `evidence_grounded_ai_systems_capstone`)
        - Integrated Python and AI Capstone (used in all four capstone credential names)

        No badge uses the words 'Senior', 'Staff', 'Principal',
        'Distinguished', 'Master' (as an industry title), 'Architect'
        (as an industry title), 'Lead' (as an industry title), or any
        other industry seniority word. Where the word 'Master' appears,
        it is in the curriculum-internal label 'Integrated Mastery' or
        'Phase 3 — Mastery Walked', which the badge explicitly
        non-claims as an industry title.

        Where the word 'Architecture' appears (in 'Architecture Decision
        Practice' and in the `architecture_leadership` skill node), it
        refers to the technical activity of making architecture
        decisions, not to the industry title 'Architect'.
    """))
    p("")
    return "\n".join(lines) + "\n"


def _claim_register_section(lines, family):
    p = lambda s="": lines.append(s)
    for b in CATALOG_BADGES:
        if b["family"] != family:
            continue
        p(f"### `{b['badge_id']}` — {b['name']}")
        p("")
        p(f"- **Capability level:** `{b['capability_level']}`")
        p(f"- **Credential type:** `{b['credential_type']}`")
        p(f"- **Verification mode:** `{b['verification_mode']}`")
        p(f"- **Status:** `{b['status']}`")
        p(f"- **Roles aligned:** {', '.join(f'`{r}`' for r in b['roles_aligned'])}")
        p(f"- **Skill nodes ({len(b['skill_nodes'])}):** {', '.join(f'`{s}`' for s in b['skill_nodes']) if b['skill_nodes'] else '_none_'}")
        p(f"- **Critical competencies ({len(b['critical_competencies'])}):** {', '.join(f'`{c}`' for c in b['critical_competencies']) if b['critical_competencies'] else '_none_'}")
        p(f"- **Prerequisites:** {', '.join(f'`{p}`' for p in b['prerequisite_badges']) if b['prerequisite_badges'] else '_none — entry point_'}")
        p("")
        p(f"**Public claim:** {b['public_claim']}")
        p("")
        p("**Non-claims:**")
        for nc in b["non_claims"]:
            p(f"- {nc}")
        p("")
        p(f"**Newbie-friendly description:** {b['newbie_friendly_description']}")
        p("")
        p("---")
        p("")


def p_dedent(s):
    return dedent(s).strip("\n")


def eligibility_state_machine_markdown():
    lines = []
    p = lambda s="": lines.append(p_dedent(s))
    p("# Eligibility State Machine")
    p("")
    p(f"**Generated:** {NOW}  ")
    p(f"**Catalog version:** {CATALOG_VERSION}")
    p("")
    p("## Purpose")
    p("""
        This document specifies the finite-state machine that governs
        every badge's lifecycle in a learner's record. It is the
        canonical reference for both the static GitHub Pages edition
        (which implements only the local_achievement states) and the
        dynamic LMS edition (which implements the full machine).
    """)
    p("## States")
    p("""
        Every badge in a learner's record is in exactly one of the
        following states at any time:

        | State | Applies to | Meaning |
        |---|---|---|
        | `not_started` | all badges | The learner has no evidence toward this badge yet. |
        | `in_progress` | competency + verified | The learner has some evidence (one or more required activities completed) but has not met the badge's provisional floors. |
        | `eligible` | competency + verified | All provisional floors met (self-check >=85%, You Do >=80%, exam >=85%, integrator >=85%, critical competency =100%). Ready for issuance but not yet issued. |
        | `provisional` | competency + verified | Issued with provisional floor. On the dynamic LMS, this is the same as `verified` (provisional floors are the issuance floor, not a separate tier). On the static edition, this state is preview-only and never issued. |
        | `verified` | competency + verified | Server-verified issuance. Cryptographic signature attached. Visible in the learner's public record. |
        | `expired` | competency + verified | Past expiration date (3 years from issuance). The badge remains in the learner's record with an `expired` tag; the public_claim is no longer current. |
        | `revoked` | all badges | Issuance was reversed per the badge's revocation_policy. The badge is removed from the public claim register but remains in the learner's private record with the revocation reason. |
        | `superseded` | all badges | A newer badge version has replaced this one. The learner is offered a migration path to the successor badge. |
        | `retired` | all badges | The badge has been retired (curriculum deprecation). Existing holders keep the credential; new issuance is closed. |

        Progress badges (local_achievement) only ever enter `not_started`
        or `verified` (local-only). They do not expire, are not revoked
        for proficiency reasons, and are not superseded unless the
        curriculum is fundamentally restructured.
    """)
    p("## Transitions")
    p("""
        Transitions are deterministic given the inputs. The dynamic LMS
        enforces them server-side; the static edition enforces only the
        `not_started -> verified` transition for progress badges.
    """)
    p("```")
    p("stateDiagram-v2")
    p("    [*] --> not_started")
    p("    not_started --> in_progress: first required activity completed")
    p("    in_progress --> in_progress: more evidence collected, floors not met")
    p("    in_progress --> eligible: all provisional floors met")
    p("    eligible --> in_progress: new evidence lowers a component below floor (rare; only on rubric re-evaluation)")
    p("    eligible --> verified: server verifies evidence + signs credential")
    p("    eligible --> provisional: (static edition only) preview; never persisted")
    p("    verified --> expired: expiration_date passed")
    p("    verified --> revoked: revocation_trigger fired")
    p("    verified --> superseded: newer badge version published")
    p("    expired --> verified: renewed (re-defense passed, new expiration set)")
    p("    expired --> retired: badge retired by issuer")
    p("    revoked --> not_started: 180-day cool-down elapsed (plagiarism/gaming only)")
    p("    revoked --> verified: appeal upheld (issuance error / curriculum deprecation)")
    p("    superseded --> verified: successor badge earned (migration path)")
    p("    retired --> [*]: terminal")
    p("    verified --> [*]: terminal (until expiration)")
    p("```")
    p("")
    p("## Per-state inputs")
    p("""
        Each transition has a defined input contract. The dynamic LMS's
        badge service (`src/lib/badge/state_machine.ts`, to be
        implemented in Phase 7) must verify every input before
        transitioning.
    """)
    p("### `not_started -> in_progress`")
    p("""
        - **Input:** one `activity_completed` event for any
          `required_activity` of the badge.
        - **Guard:** the activity's `learner_id` matches the badge
          record's `learner_id`.
        - **Side effect:** none.
    """)
    p("### `in_progress -> in_progress`")
    p("""
        - **Input:** additional `activity_completed` or
          `rubric_score_updated` events.
        - **Guard:** none beyond learner_id match.
        - **Side effect:** update the badge's `evidence_map` with the
          new evidence pointer.
    """)
    p("### `in_progress -> eligible`")
    p("""
        - **Input:** all `required_activities` have evidence meeting
          the per-component floors in `assessment_blueprint`.
        - **Guard:** every `critical_competency` has rubric evidence at
          100% floor. (Critical competencies are non-compensatory; a
          single one below floor blocks this transition.)
        - **Guard:** every `prerequisite_badge` is in `verified` state
          for this learner.
        - **Side effect:** set `eligible_at` timestamp; notify learner.
    """)
    p("### `eligible -> verified`")
    p("""
        - **Input:** learner-initiated issuance request (or auto-issue
          on eligibility, depending on LMS configuration).
        - **Guard:** re-verify all floors (defense against
          race-conditions where evidence changed between eligibility
          and issuance).
        - **Side effect:** generate cryptographic signature over the
          badge record (issuer private key); set `issued_at` and
          `expires_at` (issued_at + 1095 days); append to
          `evidence_registry.jsonl`.
    """)
    p("### `eligible -> provisional` (static edition only)")
    p("""
        - **Input:** learner views the badge detail page on the static
          GitHub Pages edition.
        - **Side effect:** none. This is a UI-only state. The badge
          record in `localStorage` is marked `eligible` but never
          `verified`. A clear UI banner says "Verification unavailable
          on the static edition; sign in to the LMS to issue this
          credential."
    """)
    p("### `verified -> expired`")
    p("""
        - **Input:** system clock passes `expires_at`.
        - **Side effect:** set `expired_at` timestamp; update public
          claim register to show the badge as `expired`.
    """)
    p("### `verified -> revoked`")
    p("""
        - **Input:** a `revocation_trigger` from
          `revocation_policy.revocation_triggers` is fired by an
          admin, an automated plagiarism detector, or a rubric audit.
        - **Guard:** the trigger is logged with evidence pointer and
          reviewer signature.
        - **Side effect:** set `revoked_at`, `revocation_reason`,
          `revocation_evidence_pointer`; remove from public claim
          register; notify learner with appeal instructions.
    """)
    p("### `verified -> superseded`")
    p("""
        - **Input:** a new badge version is published with
          `status=active` and the old badge's `status` flips to
          `superseded`.
        - **Side effect:** set `superseded_at`, `successor_badge_id`;
          notify learner with migration path.
    """)
    p("## Concurrency and idempotency")
    p("""
        - Every transition is idempotent: re-applying the same input
          must not change the state.
        - Every transition is logged to `evidence_registry.jsonl` with
          a monotonically-increasing sequence number.
        - The state machine is single-writer per learner-badge pair:
          the dynamic LMS serializes transitions per
          `(learner_id, badge_id)` to prevent races.
        - The static edition is read-only with respect to the state
          machine; it can render `not_started`, `in_progress`, and
          `eligible` (projected from `localStorage`), but cannot
          transition to `verified`.
    """)
    p("## Audit trail")
    p("""
        Every state transition is recorded in
        `evidence_registry.jsonl` with:

        - `event_id` (UUID)
        - `learner_id`
        - `badge_id`
        - `from_state`, `to_state`
        - `input_event` (structured)
        - `guard_checks` (list of pass/fail per guard)
        - `side_effects` (list of artifacts written)
        - `timestamp` (UTC)
        - `reviewer_signature` (for `verified -> revoked` only)

        This trail is the canonical evidence for any audit of the
        credential system.
    """)
    return "\n".join(lines) + "\n"


def credential_architecture_markdown():
    lines = []
    p = lambda s="": lines.append(p_dedent(s))
    p("# PyArcana Credential Architecture")
    p("")
    p(f"**Generated:** {NOW}  ")
    p(f"**Catalog version:** {CATALOG_VERSION}  ")
    p(f"**Issuer:** {ISSUER}")
    p("")
    p("## 1. Purpose")
    p("""
        This document is the canonical architecture for PyArcana's badge
        and credential system. It specifies:

        - The four badge families and their distinct evidentiary roles.
        - The three credential types and where each is issued.
        - The non-compensatory critical-competency regime.
        - The conservative provisional floors.
        - The static vs. dynamic edition contract.
        - The legacy-progress migration contract.
        - The Stephen Fry redaction (newbie-friendly descriptions).

        It is the reference for Phase 7 (implementation) and for any
        external audit of the credential system.
    """)
    p("## 2. Design constraints (from Phase 6 specification)")
    p("""
        1. **Never exceed the evidence collected from each learner.** A
           badge cannot claim a skill the learner has no evidence for.
        2. **Not imply occupational seniority.** No 'Senior Data
           Scientist', 'Staff AI Engineer', or 'Master Software
           Engineer' badges. Capability levels are curriculum-internal
           labels.
        3. **Distinguish local achievements from verified credentials.**
           Local achievements are motivational markers; verified
           credentials are server-signed and externally auditable.
        4. **Require independent evidence (not just guided completion).**
           Theory, I Do demos, and We Do exercises never count toward
           competency badges. Only You Do projects, exams, integrator
           projects, and defenses count.
        5. **Have non-compensatory critical competencies.** A single
           critical-competency failure blocks the credential, regardless
           of strength elsewhere.
        6. **Conservative provisional floors.** self_check >=85%, You Do
           >=80%, project rubric >=85%, critical competency =100%.
        7. **Legacy course completion does NOT fabricate missing badge
           evidence.** Existing learner progress contributes to progress
           badges only.
        8. **Stephen Fry redaction.** All learner-facing badge
           descriptions are newbie-friendly with inline jargon
           explanations.
    """)
    p("## 3. Badge families")
    p(f"""
        | Family | Credential type | Count | Verification mode | Expires |
        |---|---|---:|---|---|
        | 1. Progress achievements | `local_achievement` | 5 | `local_only` | No |
        | 2. Applied-skill badges | `competency_badge` | 16 | `server_verified` | Yes (3 yrs) |
        | 3. Cross-section capability badges | `competency_badge` | 5 | `server_verified` | Yes (3 yrs) |
        | 4. Capstone credentials | `verified_credential` | 5 | `server_verified` | Yes (3 yrs) |
        | **Total** | | **31** | | |
    """)
    p("""
        **Family 1 — Progress achievements** are motivational markers.
        They record that the learner walked through a phase of the
        curriculum. They are NOT proof of proficiency and they do not
        require independent exercise performance above the
        section-level self-check floor. They are issued on both the
        static GitHub Pages edition (local_only) and the dynamic LMS
        edition (server-mirrored).

        **Family 2 — Applied-skill badges** are narrow, evidence-based
        badges proving a bounded skill bundle. Each maps to 1-3
        sections' worth of curriculum plus a bounded independent
        exercise. They are server-verified on the dynamic LMS edition
        and visible as eligibility previews only on the static edition.

        **Family 3 — Cross-section capability badges** require multiple
        sections' skills plus an integrated synthesis project. They are
        server-verified only.

        **Family 4 — Capstone credentials** are the broadest
        credentials. They require phase-capstone completion, a
        synthesis document, and an oral or written defense. They are
        server-verified only and cryptographically signed.
    """)
    p("## 4. Credential types and issuance")
    p("""
        | Credential type | Static edition | Dynamic LMS edition |
        |---|---|---|
        | `local_achievement` | Issued locally (localStorage). Visible in learner's local progress view. | Issued locally + mirrored to server. Visible in learner's profile. |
        | `competency_badge` | Eligibility preview only. NOT issued. UI banner: "Verification unavailable on the static edition." | Server-verified issuance with cryptographic signature. |
        | `verified_credential` | NOT issued. UI banner: "Sign in to the LMS to earn this credential." | Server-verified issuance with cryptographic signature + defense recording. |

        The static edition is a read-only learning surface. It can
        render the curriculum, accept You Do submissions to
        `localStorage`, and display eligibility previews for
        competency and verified credentials. It cannot issue
        competency or verified credentials because issuance requires
        server-side cryptographic signing and rubric verification.
    """)
    p("## 5. Non-compensatory critical competencies")
    p("""
        The 8 critical competencies from `industry_skill_graph.json`
        are non-compensatory. Each is graded against a 4-criterion
        rubric; all four criteria must score 100% (full credit) for
        the competency to pass. A single failing criterion blocks the
        badge.

        | Competency ID | Skills covered | Gap? |
        |---|---|---|
        | `sql_competency` | sql_fundamentals, sql_window_ctes, sql_performance_tuning | sql_performance_tuning is a curriculum gap (Phase 3 §7). Badges requiring this competency are at `pilot` status with a supplementary exercise. |
        | `leakage_prevention` | leakage_prevention, model_evaluation | leakage_prevention is a curriculum gap. Badges requiring this competency are at `pilot` status with a supplementary exercise. |
        | `selector_resilience` | selector_design, exception_handling_rpa, reframework | reframework is out-of-current-scope (PyArcana's RPA track is Python-based by design). Assessed on Python-based selectors. |
        | `type_safety_production_hardening` | python_type_safety, observability, ci_cd, packaging_reproducibility | python_type_safety is a curriculum gap. Badges requiring this competency are at `pilot` status with a supplementary exercise. |
        | `mlops_fluency` | model_deployment, mlops_pipelines, drift_monitoring, system_design | No gap. |
        | `business_framing_judgment` | business_framing, metric_design, tradeoff_articulation | No gap. |
        | `communication_audience_tuned` | written_communication, oral_communication, stakeholder_translation | No gap. |
        | `reproducibility_determinism` | packaging_reproducibility, git_workflow, testing_discipline | No gap. |

        Badges at `pilot` status (8 of 31) are technically attainable
        today, but the learner must complete a supplementary
        independent exercise for the gap-affected competency. Once
        Phase 4 closes the curriculum gap, the badge is upgraded to
        `active` status; existing holders do not need to re-test
        (their supplementary exercise evidence is preserved as
        equivalent).
    """)
    p(f"## 6. Provisional floors")
    p(f"""
        The provisional floors are conservative (stricter than the
        existing exam pass@70 threshold):

        | Component | Floor |
        |---|---:|
        | self_check aggregate | {PROVISIONAL_FLOORS['self_check_pct']}% |
        | you_do project rubric | {PROVISIONAL_FLOORS['you_do_pct']}% |
        | section exam (server-graded MCQ) | {PROVISIONAL_FLOORS['section_exam_pct']}% |
        | integrator project rubric | {PROVISIONAL_FLOORS['integrator_project_pct']}% |
        | critical competency | {PROVISIONAL_FLOORS['critical_competency_pct']}% |
        | minimum overall (weighted average) | {PROVISIONAL_FLOORS['minimum_overall_pct']}% |

        These floors are the *issuance* floor, not a separate
        provisional tier. The dynamic LMS does not issue "provisional"
        vs. "full" credentials; it issues the credential when all
        floors are met. The static edition renders an "eligibility
        preview" when the floors are met in localStorage, but does
        not issue.
    """)
    p("## 7. Static vs. dynamic edition contract")
    p("""
        | Behavior | Static edition (`NEXT_PUBLIC_STATIC_SITE=1`) | Dynamic LMS edition |
        |---|---|---|
        | Render curriculum | Yes | Yes |
        | Accept You Do submissions | To `localStorage` only | To server (Prisma + SQLite) + mirror to `localStorage` |
        | Section exam scoring | Local only (UI preview); NOT authoritative | Server-side via `gradeExamAnswers()`; authoritative |
        | Issue progress badges | Yes (local_only) | Yes (server-mirrored) |
        | Issue competency badges | No (eligibility preview only) | Yes (server-verified) |
        | Issue capstone credentials | No (UI banner only) | Yes (server-verified + defense recording) |
        | Evidence persistence | `localStorage` keys `python-ds-progress`, `python-ds-lang` | Prisma models: `Progress`, `ExamAttempt`, `ExerciseAttempt`, `FeedbackReport`; plus `BadgeRecord` (new, Phase 7) |
        | Cryptographic signature | n/a | Ed25519 over the badge record (issuer private key) |
        | Revocation | n/a | Server-side; flips `BadgeRecord.status` to `revoked` |
        | Renewal | n/a | Server-side; learner re-defends; new `expires_at` set |

        The static edition is for self-study and for learners who
        cannot or will not sign in. It can show what they would be
        eligible for if they signed in to the LMS. It cannot issue
        credentials that an employer could verify, because there is
        no server-side signing key.
    """)
    p("## 8. Legacy-progress migration")
    p("""
        See `progress_migration_plan.md` for the full migration plan.
        Summary:

        1. Legacy `python-ds-progress` localStorage is read on first
           load of the new badge UI.
        2. Each legacy completed section is recorded as
           `activity_completed` for that section's You Do, self-check,
           and exam (if a score is present).
        3. Progress badges (`progress_phase0_walked` through
           `progress_journey_completed`) are evaluated against the
           legacy data. If the legacy data shows all 13 sections of a
           phase completed, the corresponding progress badge is issued
           locally (and mirrored to the server on the dynamic edition).
        4. Competency badges and capstone credentials are NOT issued
           from legacy data. The learner's eligibility is computed
           against the badge's stricter floors:
           - Legacy exam scores >=85% are accepted as evidence for the
             section exam component.
           - Legacy exam scores in the 70-84% range do NOT satisfy
             the badge floor; a fresh exam attempt is required.
           - Legacy You Do projects must be re-evaluated against the
             current badge rubric; the legacy rubric outcome is not
             accepted as-is.
           - Legacy capstone completion does NOT satisfy any capstone
             credential defense; the defense must be re-done.
        5. The learner is shown a clear "legacy migration" panel
           explaining what carried over, what did not, and what they
           need to do to earn each credential.
    """)
    p("## 9. Stephen Fry redaction (newbie-friendly descriptions)")
    p("""
        Every learner-facing badge description in this architecture
        has a `newbie_friendly_description` field with inline jargon
        explanations. Examples:

        - "BI = Business Intelligence; tools like Tableau, Power BI,
          or Looker turn data into interactive views for non-technical
          stakeholders"
        - "RAG = Retrieval-Augmented Generation; it means: when the
          LLM is asked a question, first search a knowledge base for
          relevant context, then feed that context to the LLM so its
          answer is grounded in your data instead of made up"
        - "MLOps (Machine Learning Operations) is the engineering
          discipline of running ML in production"
        - "Drift = the data the model sees in production slowly
          changing until predictions become wrong"

        The redaction is enforced by a lint rule (to be implemented in
        Phase 7): any learner-facing string in the badge UI must not
        contain an undefined acronym (an acronym not previously
        expanded in the same string or in a glossary section).
    """)
    p("## 10. Cryptographic issuance (Phase 7 implementation)")
    p("""
        Each verified credential is signed with the issuer's Ed25519
        private key. The signature covers:

        - `badge_id`
        - `version`
        - `learner_id`
        - `issued_at`
        - `expires_at`
        - `evidence_map` (JSON-canonicalized)
        - `critical_competency_scores`

        The signature is detached and stored alongside the badge
        record. Any third party can verify the signature with the
        issuer's public key (published at
        `https://pillb.github.io/pyarcana/keys/badge-issuer-public.pem`
        on the static edition and at
        `https://lms.pyarcana.example/keys/badge-issuer-public.pem`
        on the dynamic edition — actual URLs TBD in Phase 7).

        The issuer private key is stored in a server-side secret
        manager (e.g., AWS Secrets Manager, GCP Secret Manager) and
        rotated annually. Old signatures remain valid against the
        archived public key.
    """)
    p("## 11. Audit and revocation")
    p("""
        The audit trail lives in `evidence_registry.jsonl` (already
        established in Phase 0). Every state transition (see
        `eligibility_state_machine.md`) appends a line. The trail is
        append-only and cryptographically chained (each line includes
        a SHA-256 of the previous line).

        Revocation is a server-side action. It flips the
        `BadgeRecord.status` to `revoked`, sets `revoked_at`,
        `revocation_reason`, and `revocation_evidence_pointer`. The
        badge is removed from the public claim register. The learner
        is notified with appeal instructions.

        See `revocation_policy` in each badge's catalog entry for the
        full trigger list.
    """)
    p("## 12. Open items for Phase 7")
    p("""
        1. Implement `src/lib/badge/state_machine.ts` per
           `eligibility_state_machine.md`.
        2. Add `BadgeRecord` model to `prisma/schema.prisma` with
           fields: `id`, `learner_id`, `badge_id`, `version`, `status`,
           `issued_at`, `expires_at`, `evidence_map` (JSON),
           `critical_competency_scores` (JSON), `signature`, `revoked_at`,
           `revocation_reason`, `revocation_evidence_pointer`,
           `superseded_at`, `successor_badge_id`.
        3. Add API routes:
           - `POST /api/badge/eligibility` — compute eligibility for a
             learner+badge pair.
           - `POST /api/badge/issue` — issue a verified credential
             (admin or self-issue with server verification).
           - `POST /api/badge/revoke` — admin-only.
           - `GET /api/badge/verify/:signature` — public verification
             endpoint.
        4. Generate the issuer Ed25519 key pair; publish the public
           key; store the private key in a secret manager.
        5. Implement the static-edition eligibility preview UI
           (`src/components/badge/EligibilityPreview.tsx`) with a
           clear "Verification unavailable on the static edition"
           banner.
        6. Implement the legacy-progress migration script
           (`scripts/migrate_legacy_progress.mjs`) per
           `progress_migration_plan.md`.
        7. Implement the Stephen Fry redaction lint rule
           (`scripts/lint_badge_descriptions.mjs`).
        8. Address `DIV-001` (section 40 ID mismatch in
           `prisma/seed.ts`) — this blocks the
           `architecture_decision_practice` badge on the dynamic LMS
           because section 40's exam activity is unattainable.
    """)
    p("")
    return "\n".join(lines) + "\n"


def progress_migration_plan_markdown():
    lines = []
    p = lambda s="": lines.append(p_dedent(s))
    p("# Progress Migration Plan")
    p("")
    p(f"**Generated:** {NOW}  ")
    p(f"**Catalog version:** {CATALOG_VERSION}")
    p("")
    p("## 1. Purpose")
    p("""
        This document specifies how existing learner progress — stored
        in the legacy `python-ds-progress` and `python-ds-lang`
        `localStorage` keys, and in the legacy Prisma models
        (`Progress`, `ExamAttempt`, `ExerciseAttempt`) — is migrated
        into the new badge and credential system specified in Phase 6.

        The cardinal rule: **legacy course completion does NOT
        fabricate missing badge evidence.** Legacy data contributes to
        progress badges (Family 1) only. Competency badges (Families 2
        and 3) and capstone credentials (Family 4) require fresh,
        rubric-graded evidence per the badge's `evidence_rules`.
    """)
    p("## 2. Legacy data sources")
    p("""
        Three legacy data sources are migrated:

        1. **`localStorage['python-ds-progress']`** — a JSON object
           keyed by section ID, with per-section completion status and
           exam scores. This is the static-edition progress store
           (Phase 0 §3).
        2. **`localStorage['python-ds-lang']`** — language preference
           (`es` or `en`). Not migrated to badge system; preserved as
           UI preference only.
        3. **Prisma models on the dynamic LMS** — `Progress`,
           `ExamAttempt`, `ExerciseAttempt`. These contain richer data
           than `localStorage` (server-side authoritative), including
           exam attempt histories and timestamps.

        The migration script reads all three and produces a
        `BadgeEligibilityReport` per learner.
    """)
    p("## 3. Migration algorithm")
    p("""
        The migration runs in five passes, in order:

        ### Pass 1 — Section completion inventory
        For each section `SNN`:
        - Read `localStorage['python-ds-progress'][sectionId]` (if
          present).
        - Read `Progress` row for the learner+section (if on the LMS).
        - If either source shows the section marked complete, record
          `activity_completed(sectionId, type='you_do')`,
          `activity_completed(sectionId, type='self_check')`, and
          `activity_completed(sectionId, type='exam')` in the new
          badge evidence store.
        - Do NOT record exam scores yet; those are processed in Pass 2.

        ### Pass 2 — Exam score reconciliation
        For each section exam:
        - Read `ExamAttempt` rows (LMS) or `localStorage` exam score.
        - Take the highest score across all attempts.
        - If the highest score >=85%, record it as evidence for the
          badge's `section_exams` component.
        - If the highest score is in the 70-84% range, record it as
          evidence for the `progress_*` badges only; flag the section
          as `exam_below_badge_floor` for the competency badges.
        - If the highest score <70%, no evidence is recorded; the
          learner must retake the exam.

        ### Pass 3 — You Do project reconciliation
        For each section You Do:
        - Read `ExerciseAttempt` rows (LMS) or `localStorage` You Do
          completion flag.
        - If the section shows You Do completed, record it as evidence
          for `progress_*` badges.
        - Do NOT record it as evidence for competency badges; the
          legacy rubric outcome is not accepted as-is. The learner's
          eligibility for competency badges will note "You Do project
          requires re-evaluation against current rubric."

        ### Pass 4 — Progress badge issuance
        For each progress badge (`progress_phase0_walked` through
        `progress_journey_completed`):
        - Check whether all required sections are present in the
          migrated section-completion inventory.
        - If yes, issue the progress badge locally (static edition)
          or server-side (LMS).
        - If no, mark the progress badge as `in_progress` with the
          list of missing sections.

        ### Pass 5 — Competency and capstone badge eligibility
          computation
        For each competency badge and capstone credential:
        - Compute eligibility per the badge's `assessment_blueprint`,
          using the migrated evidence.
        - For each required activity:
          - If the activity is a section exam and the legacy score
            >=85%, count it as meeting the floor.
          - If the activity is a section exam and the legacy score is
            70-84%, mark it as `below_floor`.
          - If the activity is a You Do project, mark it as
            `requires_rubric_reevaluation`.
          - If the activity is missing entirely, mark it as `missing`.
        - For each critical competency:
          - Mark it as `requires_supplementary_exercise` if the
            competency is gap-affected (leakage_prevention,
            python_type_safety, sql_performance_tuning).
          - Otherwise mark it as `requires_rubric_evaluation`.
        - Do NOT issue any competency badge or capstone credential
          from legacy data alone.

        The learner sees a per-badge eligibility report with clear
        next-steps: "Retake this exam", "Re-evaluate this You Do
        project against the current rubric", "Complete this
        supplementary exercise", "Build this integrator project",
        "Schedule this defense".
    """)
    p("## 4. Learner-facing migration panel")
    p("""
        The migration panel (UI component:
        `src/components/badge/LegacyMigrationPanel.tsx`, to be
        implemented in Phase 7) shows:

        1. **What carried over** — a list of progress badges issued
           from legacy data, with the source pointer
           (`localStorage` or `Prisma`).
        2. **What did NOT carry over** — a list of competency badges
           and capstone credentials the learner is *not* yet eligible
           for, with the specific reason per badge.
        3. **What to do next** — a prioritized list of actions:
           - "Retake exam for S14 (current 72%, need 85%)"
           - "Re-evaluate You Do for S20 against the current rubric"
           - "Complete the supplementary exercise for
             leakage_prevention"
           - "Build the integrator project for
             python_data_foundations"
        4. **No-claim banner** — a clear statement: "Legacy course
           completion contributed to your progress badges only. Your
           competency badges and capstone credentials require fresh,
           rubric-graded evidence per the PyArcana credential
           architecture."
    """)
    p("## 5. Edge cases")
    p("""
        - **Learner with `localStorage` only (no LMS account):** Pass
          1-4 run on the static edition; Pass 5 produces an
          eligibility preview (NOT issuance). The learner is told to
          sign in to the LMS to issue any competency or verified
          credential.
        - **Learner with LMS account but no `localStorage`:** Pass
          1-4 run server-side; Pass 5 produces a server-side
          eligibility report.
        - **Learner with conflicting `localStorage` and LMS data:**
          The LMS data wins (it's authoritative per Phase 0 §3). The
          migration script logs the conflict to
          `evidence_registry.jsonl` and uses the LMS data.
        - **Learner with `localStorage` data for sections that no
          longer exist in the curriculum:** The migration script
          ignores the orphan data and logs it to
          `memory/rejected_hypotheses.jsonl` for review.
        - **Learner who completed a phase capstone in the legacy
          course:** The capstone completion is recorded as a
          `project_completed` event for the corresponding
          `CP-N*-X` ID. It does NOT satisfy any capstone credential
          defense requirement; the defense must be re-done.
    """)
    p("## 6. Rollback")
    p("""
        The migration is non-destructive: it never deletes or
        overwrites legacy data. It only writes to the new badge
        evidence store and to `BadgeRecord` rows (Phase 7). If the
        migration is reverted, the legacy data is intact and the
        learner's progress is preserved.
    """)
    p("## 7. Implementation milestones (Phase 7)")
    p("""
        1. `scripts/migrate_legacy_progress.mjs` — the migration
           script. Reads `localStorage` (via a headless-browser
           harness for testing) and Prisma models; writes to the new
           badge evidence store and `BadgeRecord` rows.
        2. `src/components/badge/LegacyMigrationPanel.tsx` — the
           learner-facing migration panel.
        3. `tests/adversarial/test_legacy_migration.py` — adversarial
           tests:
           - Learner with no legacy data -> no progress badges issued.
           - Learner with all 13 Phase 0 sections complete ->
             `progress_phase0_walked` issued.
           - Learner with all 13 Phase 0 sections complete but no
             exam scores >=85% -> no competency badges issued; clear
             "retake exam" guidance.
           - Learner with conflicting `localStorage` and Prisma data
             -> Prisma wins; conflict logged.
           - Learner with orphan section data -> ignored; logged.
    """)
    return "\n".join(lines) + "\n"


def main():
    catalog = {
        "version": CATALOG_VERSION,
        "generated_at": NOW,
        "generated_by": "badge_architect node (Phase 6)",
        "specification": "Phase 6 — Badge and Credential Architecture",
        "provisional_floors": PROVISIONAL_FLOORS,
        "design_constraints": [
            "Never exceed the evidence collected from each learner.",
            "Not imply occupational seniority (no Senior/Staff/Master titles).",
            "Distinguish local achievements from verified credentials.",
            "Require independent evidence (not just guided completion).",
            "Non-compensatory critical competencies.",
            "Conservative provisional floors (self_check >=85%, you_do >=80%, project rubric >=85%, critical competency =100%).",
            "Legacy course completion does NOT fabricate missing badge evidence.",
            "Stephen Fry redaction: newbie-friendly descriptions with inline jargon explanations.",
        ],
        "badge_count": len(CATALOG_BADGES),
        "family_counts": {
            "progress_achievement": sum(1 for b in CATALOG_BADGES if b["family"] == "progress_achievement"),
            "applied_skill": sum(1 for b in CATALOG_BADGES if b["family"] == "applied_skill"),
            "cross_section_capability": sum(1 for b in CATALOG_BADGES if b["family"] == "cross_section_capability"),
            "capstone_credential": sum(1 for b in CATALOG_BADGES if b["family"] == "capstone_credential"),
        },
        "badges": CATALOG_BADGES,
    }
    (BASE / "badge_catalog.json").write_text(json.dumps(catalog, indent=2, ensure_ascii=False))
    print(f"Wrote badge_catalog.json ({len(CATALOG_BADGES)} badges)")

    dep_graph = build_dependency_graph()
    (BASE / "badge_dependency_graph.json").write_text(json.dumps(dep_graph, indent=2, ensure_ascii=False))
    print(f"Wrote badge_dependency_graph.json ({len(dep_graph['edges'])} edges)")

    (BASE / "badge_claim_register.md").write_text(claim_register_markdown())
    print("Wrote badge_claim_register.md")

    for b in CATALOG_BADGES:
        path = REQ_DIR / f"{b['badge_id']}.md"
        path.write_text(requirement_markdown(b))
    print(f"Wrote {len(CATALOG_BADGES)} files to badge_requirements/")

    for b in CATALOG_BADGES:
        path = RUB_DIR / f"{b['badge_id']}.json"
        path.write_text(json.dumps(rubric_json(b), indent=2, ensure_ascii=False))
    print(f"Wrote {len(CATALOG_BADGES)} files to badge_rubrics/")

    (BASE / "eligibility_state_machine.md").write_text(eligibility_state_machine_markdown())
    print("Wrote eligibility_state_machine.md")

    (BASE / "credential_architecture.md").write_text(credential_architecture_markdown())
    print("Wrote credential_architecture.md")

    (BASE / "progress_migration_plan.md").write_text(progress_migration_plan_markdown())
    print("Wrote progress_migration_plan.md")

    _sanity_checks()


def _sanity_checks():
    errors = []
    catalog = json.loads((BASE / "badge_catalog.json").read_text())
    badge_ids = {b["badge_id"] for b in catalog["badges"]}
    for b in catalog["badges"]:
        for pb in b["prerequisite_badges"]:
            if pb not in badge_ids:
                errors.append(f"Badge {b['badge_id']} references unknown prerequisite: {pb}")
    known_cc = {
        "sql_competency", "leakage_prevention", "selector_resilience",
        "type_safety_production_hardening", "mlops_fluency",
        "business_framing_judgment", "communication_audience_tuned",
        "reproducibility_determinism",
    }
    for b in catalog["badges"]:
        for cc in b["critical_competencies"]:
            if cc not in known_cc:
                errors.append(f"Badge {b['badge_id']} references unknown critical_competency: {cc}")
    with (BASE / "industry_skill_graph.json").open() as f:
        sg = json.load(f)
    known_skills = {n["skill_id"] for n in sg["skill_nodes"]}
    for b in catalog["badges"]:
        for s in b["skill_nodes"]:
            if s not in known_skills:
                errors.append(f"Badge {b['badge_id']} references unknown skill_node: {s}")
    for b in catalog["badges"]:
        for s in b["required_sections"]:
            if not (s.startswith("S") and len(s) == 3 and s[1:].isdigit() and 1 <= int(s[1:]) <= 52):
                errors.append(f"Badge {b['badge_id']} references malformed section: {s}")
    for b in catalog["badges"]:
        for a in b["required_activities"]:
            sid = a.split("-")[0]
            if sid not in {f"S{n:02d}" for n in range(1, 53)}:
                errors.append(f"Badge {b['badge_id']} references malformed activity: {a}")

    # Check that no badge name uses forbidden seniority words
    forbidden = ["Senior ", "Staff ", "Principal ", "Distinguished "]
    for b in catalog["badges"]:
        for w in forbidden:
            if w in b["name"]:
                errors.append(f"Badge {b['badge_id']} name uses forbidden seniority word: {w}")

    # Check the dependency graph is acyclic
    dep_graph = json.loads((BASE / "badge_dependency_graph.json").read_text())
    # topological_level assigned to every badge is sufficient check
    levels = {n["badge_id"]: n["topological_level"] for n in dep_graph["nodes"]}
    for e in dep_graph["edges"]:
        if e["edge_type"] != "prerequisite":
            continue
        if e["from_badge_id"] == e["to_badge_id"]:
            continue  # self-edge for pending_upgrade
        if levels[e["from_badge_id"]] >= levels[e["to_badge_id"]]:
            errors.append(
                f"Dependency {e['from_badge_id']} -> {e['to_badge_id']} "
                f"has invalid topological levels "
                f"{levels[e['from_badge_id']]} -> {levels[e['to_badge_id']]}"
            )

    if errors:
        print("SANITY CHECK ERRORS:")
        for e in errors:
            print(f"  - {e}")
        raise SystemExit(1)
    print(f"Sanity checks passed: {len(badge_ids)} badges, all references valid, no forbidden seniority words, dependency graph acyclic.")


if __name__ == "__main__":
    main()
