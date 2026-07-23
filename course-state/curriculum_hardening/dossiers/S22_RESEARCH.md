# Research dossier — S22 Email, identidad y aprobación humana

**Section file:** `src/lib/course/sections/s22-rapidfuzz-entity.ts`  
**Platform id (preserved):** `rapidfuzz-entity`  
**V3 title:** Email, identidad y aprobación humana  
**Residual before:** PARTIAL (avg_para≈119.4, avg_instr≈85.0, thin≈0.11, score 7)  
**Target:** gold vs S01/S02 pedagogy + S16/S17 depth; **inicio CP-N2-C**

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Docs | Python email package docs; RFC 2045 MIME; OWASP XSS Prevention (escape/HTML email) |
| Book | Fluent Python / stdlib patterns for MIME multipart; *Web Security for Developers* (link/XSS hygiene) |
| Coursera | Google IT Automation / Secure coding practices — least privilege OAuth scopes |
| Stanford/MIT | CS253 Web Security (Stanford) — XSS/injection mental model applied to HTML mail bodies |
| GitHub | python/cpython Lib/email examples; googleapis gmail draft patterns (conceptual adapters only) |
| Video | Corey Schafer / Real Python email series — multipart, attachments, charset UTF-8 |

## Coverage gaps in current partial
- Theory thin on approval state machine and match≠fraude; instructions one-liners without pass strings; no 5th selfCheck on score≠fraud.
- Progressive disclosure: email.mime, html.escape, hashlib, datetime (stdlib); adaptadores sandbox de draft — sin SMTP real ni RapidFuzz avanzado.
- ES-PE workplace voice; synthetic Lima/Cusco/Arequipa; no real PII; fail-closed / no-fraud-from-scores.

## Expansion plan
1. Deepen 9 theory blocks to 3 paragraphs (~250+ chars) with *why*, *contract*, Peru synthetic case.
2. Expand 24 weDo instructions to ≥150 chars: concept, fixture id, I/O, exact pass string.
3. Enrich thin starters with solution fixtures + single TODO; keep solution oracles.
4. Add 5th selfCheck MCQ on operational/governance failure mode.
5. DONE note + metric recompute (avg_para≥250, avg_instr≥150, thin_para_ratio(<120)≤0.2).
