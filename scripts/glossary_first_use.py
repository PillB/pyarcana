"""Pure semantic define-before-use gate for rendered learner-packet events."""

HIDDEN_EVENT_KINDS = {"solution", "hidden_test", "answer_key", "reviewer_note"}


def audit_concept_events(payload: dict) -> dict:
    """Validate define-before-use over ordered, learner-visible packet events."""
    active = payload.get("active_section_ids", [])
    section_order = {section_id: index for index, section_id in enumerate(active)}
    issues: list[dict] = []

    visible_events = [
        event
        for event in payload.get("events", [])
        if event.get("learner_visible", True)
        and event.get("kind") not in HIDDEN_EVENT_KINDS
        and event.get("section_id") in section_order
    ]
    visible_events.sort(
        key=lambda event: (
            section_order[event["section_id"]],
            event.get("display_order", 0),
        )
    )

    for term in payload.get("terms", []):
        term_id = term["id"]
        declared = term["firstSectionId"]
        if declared not in section_order:
            issues.append(
                {
                    "code": "STALE_ROUTE_ID",
                    "term_id": term_id,
                    "declared_first": declared,
                    "severity": "P1",
                    "location": "glossary.firstSectionId",
                }
            )
            continue

        mentions = [event for event in visible_events if term_id in event.get("mentions", [])]
        definitions = [event for event in visible_events if term_id in event.get("defines", [])]
        requirements = [event for event in visible_events if term_id in event.get("requires", [])]
        first_mention = mentions[0] if mentions else None
        first_definition = definitions[0] if definitions else None
        first_requirement = requirements[0] if requirements else None

        if first_definition is None and (first_mention or first_requirement):
            witness = first_requirement or first_mention
            issues.append(
                {
                    "code": "NO_VISIBLE_DEFINITION",
                    "term_id": term_id,
                    "severity": "P1",
                    "location": witness.get("location"),
                }
            )
            continue

        if first_mention and first_definition and visible_events.index(first_mention) < visible_events.index(first_definition):
            issues.append(
                {
                    "code": "USE_BEFORE_DEFINITION",
                    "term_id": term_id,
                    "severity": "P1",
                    "location": first_mention.get("location"),
                    "definition_location": first_definition.get("location"),
                }
            )

        if first_requirement and first_definition and visible_events.index(first_requirement) < visible_events.index(first_definition):
            issues.append(
                {
                    "code": "DEFINITION_AFTER_REQUIREMENT",
                    "term_id": term_id,
                    "severity": "P1",
                    "location": first_requirement.get("location"),
                    "definition_location": first_definition.get("location"),
                }
            )

    return {"ok": not issues, "issues": issues}
