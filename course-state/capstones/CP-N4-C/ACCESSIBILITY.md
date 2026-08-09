# ACCESSIBILITY — CP-N4-C harness (esto es, un arnés: la estructura que orquesta, limita y observa a los agentes mientras trabajan)

## Scope
The harness is a Python library consumed by `demo.py`, the adversarial
tests, and CP-FINAL. It has no GUI of its own. Accessibility therefore
applies to:

1. **Programmatic output** — `CopilotRunRecord.to_dict()` is a plain JSON
   structure; every field is a string, number, boolean, list or dict. No
   information is conveyed by colour alone.
2. **Documentation** — BRIEF, SYSTEM_CARD, SECURITY, PRIVACY,
   RESPONSIBLE_USE, IDO/WEDO/YOUDO, FINAL_INTERFACE and SUBGATES are plain
   Markdown with semantic headings, no required diagrams, and ASCII-only
   tables.
3. **Console output** — `demo.py` prints a single `METRICS_JSON:` line
   followed by a short human-readable summary. Both are screen-reader
   friendly and contain no colour codes.
4. **Keyboard operation** — All entry points are CLI/Python; no pointer
   device is required.

## Conformance target
This artefact aligns with the spirit of WCAG 2.1 AA at the API and
documentation layer. Where the harness is embedded in a graphical product
(a future dashboard, a notebook UI), the embedding product is responsible
for the visual-layer accessibility conformance.

## Reasonable accommodations supported
- determinista (esto es, que dado el mismo input siempre produce el mismo output, sin azar) no-key mode means screen-reader users can replay runs at
  their own pace without network or time pressure.
- Every run produces a stable JSON record that can be diffed with standard
  text tools, supporting users who navigate by structured comparison.
- `redact()` ensures that no PII is forced into a screen reader's buffer
  when a trace is read aloud.
