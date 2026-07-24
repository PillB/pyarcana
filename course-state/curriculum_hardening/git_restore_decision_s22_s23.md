# Git restore decision — S22 / S23 (2026-07-23)

## Policy
Restore from git history **only** if working tree is strictly worse than a historical commit (more empty TODO, more theater, fewer DEFECT scaffolds, thinner pedagogy).

## S22 (`s22-rapidfuzz-entity.ts` — Email, identidad y aprobación humana)
| Ref | lines | empty `# TODO` | theater printTODO | DEFECT markers | notes |
|-----|-------|----------------|-------------------|----------------|-------|
| WORKTREE | 1551 | 0 | 1 (youDo print TODO) | 0 weDo DEFECT | theater TODO stubs in weDo |
| HEAD / ebc86eb | 1551 | 0 | 1 | 0 | same as worktree for body |
| aa57e1c | 1556 | 0 | 1 | 0 | rich starters still TODO-shaped |
| ad5e235 / 6290f0c | ~1470 | **20** | 1 | 0 | worse empty-TODO baseline |

**Decision: NO RESTORE.** Worktree ≥ HEAD and strictly better than ad5e235 on empty TODO. Harden in place: CASO-LIM-022 DEFECT starters, theory/iDo 8/8 def, youDo Contrato.

## S23 (`s23-computer-vision.ts` — browser RPA / locators per V3)
| Ref | DEFECT | tdef/idef |
|-----|--------|-----------|
| WORKTREE | ~24+ CASO-LIM-023 | 8/8 pattern |

**Decision: NO RESTORE.** Peer already gold-shaped; docs/PA polish only if needed after S22.

## Quarantine
Bulk rewriters remain `scripts/quarantine_bulk_rewriters/*.disabled` (and course-state copies). Do not re-enable.
