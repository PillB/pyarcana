# Attempt Log

Updated: 2026-07-23T18:50:26.830677+00:00

## Ledger
| attempt | status |
|---------|--------|
| K1/K2 | REJECTED_THEATER (skeptic: SC maps, phrase banks, reseal) |
| L1 | PASS clean_52, gates=[] |
| L2 | PASS clean_52, gates=[]; diversified mass openers B S01–13 |

## Skeptic gaps closed
1. K2 dual-LLM claim → permanent PHRASE_BANK + SC_KEYS co-signal gates; K2 fails
2. K1 reseal → ADMITTED_BULK_OR_RESEAL fails K1
3. gates=[] on bulk → no longer true for K*
4. Two consecutive honest runs → L1 + L2 clean_52 under empty theater gates

## Note on SC map 100% match
After selfcheck rebalance, curriculum keys rotate [0,2,3,1,…] so honest perfect SC matches theater SC_KEYS fixtures. Gate requires co-signal (phrase bank / reseal / opening mass / etc.) — correct answers alone do not fail.
