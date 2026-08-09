# Git restore decision S11–S12 (2026-07-24)

| File | WT DEFECT | HEAD DEFECT | WT lines | HEAD lines | Decision |
|------|-----------|-------------|----------|------------|----------|
| s11-testing.ts | 24 | 0 | 2118 | 1908 | **KEEP worktree** — richer DEFECT CASO starters |
| s12-performance.ts | 29 | 0 | 1842 | 1703 | **KEEP worktree** — richer DEFECT + https |

Recent commits touching these files (`92a0bcf`, `ad5e235`) predate hand CASO DEFECT expansion.
Bulk rewriters remain quarantined under `scripts/quarantine_bulk_rewriters/*.disabled` (16).
No restore from history.
