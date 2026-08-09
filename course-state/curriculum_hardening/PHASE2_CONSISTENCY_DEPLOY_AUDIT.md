# Phase 2 — Cross-curriculum consistency & deploy audit

Generated: 2026-07-24T05:28:44.181280+00:00

## Registered curriculum
- **52/52** sections imported in `src/lib/course/index.ts`
- Duplicate titles: none
- Orphan section files (not imported): **5** (examples: ['s11-advanced-topics.ts', 's09-sklearn.ts', 's07-pandas.ts', 's10-testing.ts', 's08-visualization.ts'])

## Roadmaps
- `learning_roadmap.md`
- `learning_roadmap_52_V3.md`

## Live site
- https://pillb.github.io/pyarcana/ — HTTP **200**, `lang=es-PE`, PyArcana brand present
- Snapshot size captured under SCRATCH `live_pyarcana.html`

## Tooling scripts
```json
{
  "build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/",
  "build:static": "node scripts/build_static_export.mjs",
  "test:v3-counts": "node scripts/v3_regression_counts.test.mjs",
  "test:v3-structure": "python3 scripts/check_section_structure.py",
  "test:v3-invariant": "python3 scripts/v3_invariant_validator.py",
  "test:v3": "npm run test:v3-counts && npm run test:v3-structure && npm run test:v3-invariant",
  "test:layout": "python3 scripts/layout_bounds_check.py --self-test",
  "test:layout:playwright": "npx playwright test scripts/v3_regression.spec.ts --reporter=line",
  "test:course-complete": "python3 scripts/course_complete_gate.py",
  "test:all-gates": "npm run test:v3 && npm run test:layout && npm run test:course-complete && npx playwright test scripts/v3_regression.spec.ts --reporter=line",
  "test:e2e-max:catalog": "node scripts/export_interaction_catalog.mjs",
  "test:e2e-max": "npm run test:e2e-max:catalog && npx playwright test -c scripts/e2e_max/playwright.max.config.ts",
  "test:e2e-max:shard": "npx playwright test -c scripts/e2e_max/playwright.max.config.ts",
  "test:e2e-max:smoke": "npm run test:e2e-max:catalog && npx playwright test -c scripts/e2e_max/playwright.max.config.ts scripts/e2e_max/01_chrome_pages.spec.ts scripts/e2e_max/06_student_admin_flows.spec.ts scripts/e2e_max/11_admin_analytics.spec.ts",
  "test:glossary-intro": "python3 scripts/glossary_intro_audit.py",
  "test:glossary-coverage": "python3 scripts/glossary_coverage_audit.py",
  "test:i18n-parity": "node scripts/i18n_parity_check.mjs",
  "test:a11y-contrast": "node scripts/a11y_contrast_check.mjs",
  "test:code-syntax-contrast": "node scripts/code_syntax_contrast_check.mjs",
  "test:python-content": "python3 scripts/python_content_runtime_audit.py --workers 4",
  "test:exam-pedagogy": "python3 scripts/exam_selfcheck_pedagogy_audit.py",
  "test:readability-contrast": "npm run test:code-syntax-contrast && BASE_URL=http://localhost:3000 npx playwright test -c scripts/e2e_max/playwright.max.config.ts scripts/e2e_max/12_readability_exhaustive.shard.spec.ts --reporter=line",
  "test:readability-contrast:full": "READABILITY_FULL=1 npm run test:readability-contrast",
  "test:ux-gates": "npm run test:glossary-intro && npm run test:glossary-coverage && npm run test:i18n-parity && npm run test:a11y-contrast && npm run test:code-syntax-contrast",
  "test:s01-first-use": "python3 scripts/s01_first_use_audit.py",
  "test:s01-glossary-coverage": "python3 scripts/s01_glossary_coverage.py",
  "test:s01-pedagogy": "npm run test:s01-first-use && npm run test:s01-glossary-coverage",
  "test:ux-campaign:static": "npm run test:ux-gates && npm run test:s01-pedagogy && npm run test:e2e-max:catalog",
  "test:ux-campaign:smoke": "npm run test:ux-campaign:static && BASE_URL=http://localhost:3000 npx playwright test -c scripts/e2e_max/playwright.max.config.ts scripts/e2e_max/01_chrome_pages.spec.ts scripts/e2e_max/06_student_admin_flows.spec.ts scripts/e2e_max/07_glossary_i18n_a11y.spec.ts scripts/e2e_max/10_feedback.spec.ts",
  "test:adversarial:node": "node --import tsx --test tests/adversarial/*.test.ts tests/adversarial/*.test.mjs",
  "test:adversarial:py": "python3 -m unittest discover -s tests/adversarial -p 'test_*.py' -v",
  "test:adversarial": "npm run test:adversarial:node && npm run test:adversarial:py",
  "test:unit": "npm run test:adversarial && npm run test:v3-counts && npm run test:exam-pedagogy"
}
```

## Residual (post final sweep)
See RESIDUAL_MAP_EXPERT.json — workbench/stack/doc/soft TODO **0**.

## Consistency notes
- V3 titles may diverge from legacy file stems (e.g. s11-testing → OOP domain); roadmap V3 is authoritative.
- S52 senior-master validation: dossiers/S52_SENIOR_MASTER_VALIDATION.md
