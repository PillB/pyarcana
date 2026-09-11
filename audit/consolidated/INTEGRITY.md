# Integrity report — defects in the audit registry itself

Found while consolidating the four `ReviewerFixer/*.zip` conversation exports against the
`audit/lessons-only-adversarial-20260903` branch. These are problems with the **audit data**,
separate from the 2,124 curriculum findings the audits recorded.

## 1. Four registry files were committed as invalid JSON

Each was already malformed in the originating `create_file` call in the conversation, so this is
not git or transfer corruption — the audit agent wrote broken JSON and nothing validated it.
Repaired copies are in `repaired/`; the originals on the audit branch are untouched.

| File | Defect | Repair |
|---|---|---|
| `sections/S02.json` | 2 invalid `\'` escapes (not legal JSON) | unescape to `'` |
| `sections/S07.json` | unescaped `"` inside `r"..."` in a string value | escape the inner quotes |
| `sections/S25.json` | finding object missing its closing `}` before `]` | insert `}` |
| `sections/S37.components.json` | `interactive_playground` opens `{` but closes `}]` | add the missing `[` |

Without repair these four files are unreadable by any JSON consumer, so **S02, S07, S25 and S37**
silently drop out of any automated pass over the registry.

## 2. Findings that exist only in the chat exports

22 findings were produced during the audits but never written to the branch. They exist
only inside the conversation JSON in the zips, so any fixer working from the branch would miss them.

| Section | ID | Severity | Issue |
|---|---|---|---|
| S41 | S41-X08 | UNSPEC | 201 is central in theory/self-check but absent from final acceptance. |
| S41 | S41-X09 | UNSPEC | Types/ranges/Pydantic promised; key-presence validator graded. |
| S41 | S41-X10 | UNSPEC | read compatibility promised; no old consumer executes. |
| S41 | S41-X11 | UNSPEC | timeout/rate/trace/rollback/least privilege are named/scored but not accepted by tests. |
| S41 | S41-X12 | UNSPEC | recovery assessment collapses CPU isolation and durability again. |
| S42 | S42-F37 | P2 | There is at least one visible sentence-boundary grammar error and several avoidable code-switching fragments. |
| S42 | S42-F38 | P1 | The resources link to superseded NIST SP 800-63-3. |
| S42 | S42-F39 | P1 | The resources link to NIST SP 800-88 Rev.1, withdrawn in September 2025 and superseded by Rev.2. |
| S42 | S42-F40 | P2 | Resources include RFC 6749 but omit the current OAuth 2.0 Security Best Current Practice RFC 9700. |
| S42 | S42-F41 | P2 | The optional reference block hardcodes redaction_holds=True before any evidence is computed. |
| S42 | S42-F42 | P2 | All eight subtopics repeat the same E1 repair-predicate / E2 valid-adversarial-missing / E3 continue-breach-re |
| S42 | S42-X01 | UNSPEC | Types/Pydantic are promised; key sets are executed. |
| S42 | S42-X02 | UNSPEC | Contract evolution is taught but omitted from final readiness. |
| S42 | S42-X03 | UNSPEC | Authenticated principal becomes names/prefixes and service identity disappears from final project. |
| S42 | S42-X04 | UNSPEC | Strong SSRF/path explanation degrades to hostname/string checks everywhere assessment occurs. |
| S42 | S42-X05 | UNSPEC | Security supply-chain evidence becomes flags and then disappears from final project. |
| S42 | S42-X06 | UNSPEC | Retention expiry is not executed and disappears from final project. |
| S42 | S42-X07 | UNSPEC | No-reappearance/key separation becomes field-name/empty-store assertions. |
| S42 | S42-X08 | UNSPEC | S42 repeatedly claims capstone promotion two steps before canonical gate. |
| S46 | S46-X01 | P0 | Incorrect allowed-lateness model propagates theory→figure→I Do→We Do→selfCheck→You Do. |
| S46 | S46-X03 | P1 | Missing-first E3 state machines mask already-known breaches across all eight domains. |
| S46 | S46-X06 | P1 | S46 copy blurs `increment toward CP-N4-B` with closure gate, which belongs to S47. |

## 3. S52 granular element inventory is missing

`sections/S52.json` records `full_granular_json_elements: 179` and a
`full_granular_json_sha256`, but the referenced granular file is not on the branch and not in any
zip. S52's 90 findings survive; the 179-element inventory behind them cannot be verified.

## 4. Two severity vocabularies are mixed

229 of 234 audit documents grade findings `P0/P1/P2`. Five use `critical/high/medium` instead.
Read naively, `high` looks like top severity and inflates P0 — that single ambiguity moved S38
from 41 P0 findings to 2. The consolidation maps severity per-file by detected vocabulary and
keeps the original string in `severity_raw`.

## 5. Schema drift across the campaign

The 234 documents use 104 distinct list keys for their contents, and findings appear in five
different shapes: objects in a named list, a singular `finding` object, an `adds` list, positional
arrays (`[id, severity, location, evidence, impact, fix]`), and bare objects in Python literals
inside code cells. Each shape needed its own reader; a registry consumer that handles only the
common case silently under-reports.

## Validation

`validation.json` holds the cross-source test results. All five checks pass:

- **T1** — all 5,393 element→finding references resolve (0 dangling)
- **T2** — no section extracts fewer findings than its own declared `severity_counts`
- **T3** — all 52 sections represented
- **T4** — findings carrying no fix, impact or evidence stay under the 25% threshold
- **T5** — all 22 `critical_findings` cross-references resolve

T1 and T2 each caught real extraction gaps while this registry was being built (S23-F27 and
S28-F35 held in containers not yet read; 13 S41 findings stored as positional arrays).