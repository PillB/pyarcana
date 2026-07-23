# Research dossier — S24 OCR y Document AI

**Section file:** `s24-rpa-advanced.ts`  
**Title:** OCR y Document AI  
**Residual:** STUB (avg_para≈86, avg_instr≈50, starters min≈7)  
**Target:** gold vs S01/S02 pedagogy + CP-N2-C document intake contracts  

## Competitive sources

| Class | Named sources & takeaways |
|-------|---------------------------|
| Coursera | *How Google does Machine Learning* / Document AI overviews; *Python for Everybody* + imaging modules; DeepLearning.AI production courses on confidence thresholds and human review |
| MIT | MIT OCW computer vision preprocessing (deskew, contrast, noise); document layout as geometric structure before recognition |
| Stanford | CS231n preprocessing hygiene; reading-order / layout cues; confidence calibration themes for detection systems |
| Harvard | Data science / digital humanities OCR workshops — language packs, evaluation on golden pages, privacy of scanned corpora |
| Yale | Digital collections OCR quality metrics — field-level accuracy, abstention vs forced decode |
| GitHub | `tesseract-ocr/tesseract` + `pytesseract`; `ocrmypdf`; layout parsers (pdfplumber patterns); awesome-ocr lists; synthetic invoice fixtures |
| Video | Tesseract/OpenCV document preprocessing tutorials; Google Document AI demos emphasizing bounding boxes + confidence |

## Coverage gaps in current stub
- Theory too thin on **why** DPI/deskew order, per-field confidence, and schema versioning matter for intake SLAs.
- Exercises say “imprime X” without naming concept, fixture id, or pass string in full contract form.
- Missing explicit **no-fraud** policy language: RUC/total mismatch → `review_not_fraud`, never auto-fraud.
- Starters lack synthetic factura/RUC fixtures and clear single-defect TODOs.

## Expansion plan
1. Deepen 9 theory blocks (≥3 × ≥180 chars) with synthetic Peru facturas/IDs and adapter real/fake boundary.
2. Expand 24 weDo instructions ≥150 chars with I/O contracts and exact pass strings.
3. Enrich starters; preserve solution outputs and progressive disclosure (no cloud Document AI SDK required in graded exercises).
4. Keep privacy/hostile-file gates and human_rescan fallback as fail-closed paths.
