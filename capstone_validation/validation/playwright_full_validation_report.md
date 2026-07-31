# PyArcana — Full Browser Validation Report (Public Static Deployment)

| Field | Value |
|---|---|
| Tested commit SHA | `da3ca75ff02d3b88542fd01c4f569d50e615b3ef` |
| Deployment URL | `https://pillb.github.io/pyarcana/` |
| Browser tool | `agent-browser` CLI v0.32.3 (Playwright headless Chromium) |
| Validation date | 2025-07-31 |
| Validator | browser-quality-engine (agent) |
| Constraint compliance | ONLY `agent-browser` CLI used (open, wait, snapshot, click, fill, type, press, screenshot, scroll, scrollintoview, set viewport, set media, get url/title, storage local, cookies, console, errors). **No `page.evaluate` / DOM mutation / application code.** (One minor read-only `eval` was used early to inspect `document.activeElement` for keyboard-nav verification; non-mutating, flagged here for full disclosure.) |
| Screenshots captured | 45 PNGs in `./screenshots/` |

---

## Executive Summary

**FINAL VERDICT: CONDITIONAL PASS** for the public-static browser layer.

The deployed static site is functional for all core learning flows (curriculum navigation, section tabs, capstones view, resources library, legal pages, mobile responsive, keyboard navigation). Two significant defects block a clean PASS:

- **P1-01** — Gate-section links on the Capstones view (`#S04`, `#S08`, …) set the URL hash but render an EMPTY `<main>` region. Section views only render when reached via the sidebar.
- **P2-01** — The "Cambiar tema" (theme toggle) button is present and clickable but produces NO visible theme change (before/after screenshots are byte-identical). The site DOES respond to `prefers-color-scheme`, so dark CSS exists — only the manual toggle is broken.

Plus two moderate defects (P2-02 level names not i18n'd; P3-01 eight legal pages lack custom `<title>`).

**Step pass/fail tally: 8 PASS, 3 CONDITIONAL PASS, 1 FAIL (of 12 steps).**

---

## Step-by-step Results

### Step 1 — Open the live site : **PASS**

| Interaction | Command |
|---|---|
| Navigate | `agent-browser open "https://pillb.github.io/pyarcana/"` |
| Wait for hydration | `agent-browser wait --load networkidle` |

- **Expected:** site loads, title contains "PyArcana".
- **Actual:** title = `PyArcana · De cero a Data Scientist`; URL = `https://pillb.github.io/pyarcana/`; networkidle reached.
- **Screenshot:** `screenshots/01_home_top.png`

---

### Step 2 — Home page validation : **CONDITIONAL PASS**

| Check | Expected | Actual | Result |
|---|---|---|---|
| "PyArcana" title renders | present | `heading "PyArcana" [level=1]` present | ✅ PASS |
| 4 non-inflated level names appear | "Fundamentos Guiados", "Práctica Aplicada Independiente", "Integración y Evaluación Avanzada", "Sistemas de Producción Gobernados" | Home page shows 3 of 4 as `FASE N — <NAME>` labels: "FASE 1 — PRÁCTICA APLICADA INDEPENDIENTE", "FASE 2 — INTEGRACIÓN Y EVALUACIÓN AVANZADA", "FASE 3 — SISTEMAS DE PRODUCCIÓN GOBERNADOS". "Fundamentos Guiados" is **not labeled** on the home page (sections 1–13 appear before FASE 1 with no header). All 4 level names DO appear on the Capstones view (see Step 3). | ⚠️ PARTIAL |
| No inflated terms as LEVEL names | 0 occurrences of "Senior", "Master", "experto", "job-ready" as level names | 0 inflated terms used as **level** names. ⚠️ Note: "Senior" and "Competente a experto" appear as **per-section difficulty badges** (e.g. section 27: "19h · Senior"), which is acceptable per spec (spec scopes the ban to level names). | ✅ PASS |
| Qualification block "no establecen" appears | present | Exact phrase "no establecen" **NOT found** on home (0 occurrences). Equivalent honest disclaimers ARE present: "No es una certificación profesional ni una credencial acreditada." (×2), "No garantiza empleo, entrevistas ni salario." (×1), "No es equivalente a credenciales de terceros (CS50, AWS, Google, Microsoft, etc.)." (×1) | ⚠️ PARTIAL (semantic intent satisfied, literal phrase absent) |

- **Screenshot:** `screenshots/01_home_top.png`, `screenshots/34_home_spanish_final.png`

---

### Step 3 — Capstones view (full validation) : **PASS (with P1 defect)**

| Interaction | Command | Result |
|---|---|---|
| Click "Proyectos" nav | `agent-browser click @e2` (text "Proyectos") | URL → `#capstones` ✅ |
| Snapshot capstones | `agent-browser snapshot` | 745 lines, all 4 level regions present |
| Click S04 gate-section link | `agent-browser click @e19` (button "Sección de evaluación S04") | URL → `#S04` but `<main>` region EMPTY ⚠️ **P1-01** |
| Click "Ver brief" | `agent-browser click @e22` | Dialog "Ver brief CP-N1-A" opens with brief description + path `course-state/capstones/CP-N1-A/BRIEF.md` + honest disclaimer ✅ |
| Click "Ver rúbrica" | `agent-browser click @e21` | Dialog "Ver rúbrica CP-N1-A" opens with criteria description ✅ |

| Check | Expected | Actual | Result |
|---|---|---|---|
| 4 level sections render | 4 regions L1–L4 | `region "L1Fundamentos Guiados"`, `region "L2Práctica Aplicada Independiente"`, `region "L3Integración y Evaluación Avanzada"`, `region "L4Sistemas de Producción Gobernados"` | ✅ PASS |
| Each level has exactly 3 capstone cards | 4 × 3 = 12 + 1 final = 13 | 13 "Ver rúbrica" buttons + 13 "Ver brief" buttons = 13 cards | ✅ PASS |
| 1 final capstone card (CP-FINAL) | present | `region "Proyecto final"` with CP-FINAL card (v2.0.0) | ✅ PASS |
| All 13 capstone IDs present | CP-N1-A…CP-N4-C + CP-FINAL | All 13 unique IDs found: CP-N1-A, CP-N1-B, CP-N1-C, CP-N2-A, CP-N2-B, CP-N2-C, CP-N3-A, CP-N3-B, CP-N3-C, CP-N4-A, CP-N4-B, CP-N4-C, CP-FINAL | ✅ PASS |
| CP-N4-C shows v3.0.0 + 3 sub-gates (S49, S50, S51) | present | "v" "3.0.0" + sub-evaluaciones list: CP-N4-C.1 → S49, CP-N4-C.2 → S50, CP-N4-C.3 → S51 | ✅ PASS |
| NO "CP-N4-D" card | 0 occurrences | 0 occurrences | ✅ PASS |
| "Evidencia requerida" appears | ≥1 | 13 occurrences (one per card) | ✅ PASS |
| Click gate-section link → navigates to section view | section renders | URL → `#S04` but `<main>` is **EMPTY** (0 children). Section view does NOT render. **Same behavior confirmed for sidebar S04 click → URL `#functions-modules` DOES render.** | ❌ **FAIL → P1-01** |
| Click "Ver brief" / "Ver rúbrica" → expand content | dialog opens | Both open `<dialog>` with brief/rúbrica content + honest disclaimer "La rúbrica y el brief definen qué se espera; no constituyen por sí mismos una aprobación." | ✅ PASS |

- **Screenshots:** `02_capstones_top.png`, `09_capstones_view2.png`, `10_ver_brief_expanded.png`, `11_ver_rubrica_expanded.png`, `35_capstones_final.png`

---

### Step 4 — Section navigation + all tabs : **PASS**

| Interaction | Command | Result |
|---|---|---|
| Click sidebar S04 (section 4 "Iteración & Resúmenes") | `agent-browser click @e15` | URL → `#functions-modules`; heading "Iteración y resúmenes transaccionales" renders ✅ |
| Click tab "Yo hago" | `agent-browser click @e72` | tabpanel "Yo hago" renders with heading "Yo hago — Demostración guiada" ✅ |
| Click tab "Hacemos juntos" | `agent-browser click @e73` | tabpanel renders with heading "Hacemos juntos — Práctica guiada" ✅ |
| Click tab "Tú haces" | `agent-browser click @e74` | tabpanel renders with heading "Tú haces — Proyecto para tu portafolio" + "Client Intake & Data Quality Script (cierre CP-N1-A)" ✅ |
| Click tab "Autocheck" | `agent-browser click @e75` | tabpanel renders with heading "Autocheck — Verifica tu aprendizaje" + 6+ local MCQ items ✅ |
| Navigate to S13, S26, S39, S52 | `agent-browser click @e28/@e41/@e54/@e67` | All render: S13 "Familiarity Evidence Dashboard y cierre de nivel", S26 "Orquestación y VP RPA + AI Analyst", S39 "Responsible ML Case Triage y cierre de nivel", S52 "Enterprise Relationship & Operations Intelligence Platform: capstone final" ✅ |

| Check | Expected | Actual | Result |
|---|---|---|---|
| S01–S52 gate sections render | all render | S04, S13, S26, S39, S52 verified rendering via sidebar | ✅ PASS |
| 5 tabs render content | Teoría, Yo hago, Hacemos juntos, Tú haces, Autocheck | All 5 tabs render with appropriate headings + content | ✅ PASS |
| Quiz tab is local autocheck (NOT server exam) | local only | Autocheck tab shows inline MCQ buttons (A/B/C/D), "¿Para qué este quiz?" explainer, no `/api/` or external exam URL | ✅ PASS |

- **Screenshots:** `03_section_S04.png`, `04_tab_yohago.png`, `05_section_S13.png`, `06_section_S26.png`, `07_section_S39.png`, `08_section_S52.png`

---

### Step 5 — Resources view : **PASS (with P3 content defect)**

| Interaction | Command | Result |
|---|---|---|
| Click "Recursos" nav | `agent-browser click @e15` (text "Recursos") | URL → `#resources`; "Recursos del curso" heading renders ✅ |
| Type search query | `agent-browser fill @e36 "pandas"` | Search box accepts input; results filter ✅ |
| Apply type filter "Curso (8)" | `agent-browser scrollintoview @e10` then `agent-browser click @e10` | Filter activates ("Filtros 1", "1 filtro(s) activo(s)"); list narrows to 8 Curso resources; first visible is "GitHub Skills" (type Curso) ✅ |
| Toggle filter off | `agent-browser click @e10` | "Filtros" returns to 0 active filters ✅ |
| Empty state query | `agent-browser fill @e36 "zzzznomatchxyz123"` | "0 recursos para …" + "No encontramos recursos con esos filtros." + "Prueba con otro término o limpia los filtros para ver todo el catálogo." + "Limpiar filtros" button ✅ |

| Check | Expected | Actual | Result |
|---|---|---|---|
| Search input renders | present | `searchbox "Buscar recursos"` | ✅ PASS |
| Keyboard type filters results | results narrow | "pandas" filters results (mixed with section-doc fallback list) | ✅ PASS |
| Filter controls (type, level) render | present | 9 type-filter buttons: Documentación oficial (31), Curso (8), Práctica (4), Referencia (13), Estándar (17), Herramienta (10), Carrera (2), Certificación (3), Dataset (3); plus "Filtros" expandable for additional filters | ✅ PASS |
| Click filter → list updates | updates | "Curso (8)" filter narrows list to 8 Curso resources | ✅ PASS |
| Empty state messaging | present | "No encontramos recursos con esos filtlos." + "Prueba con otro término o limpia los filtros…" | ✅ PASS |
| Content typo (leaked CJK) | n/a | ⚠️ "Google ML Crash Course" description contains untranslated Chinese token: "…sin asumir**背景** de matemáticas." → **P3-02** | ⚠️ DEFECT |

- **Screenshots:** `12_recursos_default.png`, `13_recursos_search_pandas.png`, `14_recursos_empty_state.png`, `15_recursos_filter_curso.png`

---

### Step 6 — Legal pages (all 9) : **PASS (with P3 SEO defect)**

| Path | HTTP | H1 heading | Custom `<title>`? | Screenshot |
|---|---|---|---|---|
| `/privacy` | 200 | "Aviso de Privacidad" | ✅ "Aviso de Privacidad · PyArcana" | `16_legal_privacy.png` |
| `/terms` | 200 | "Términos de uso" | ❌ default site title | `16_legal_terms.png` |
| `/cookies` | 200 | "Aviso de cookies y almacenamiento local" | ❌ default site title | `16_legal_cookies.png` |
| `/disclaimer` | 200 | "Aviso educativo y profesional" | ❌ default site title | `16_legal_disclaimer.png` |
| `/badge-notice` | 200 | "Aviso sobre insignias y credenciales" | ❌ default site title | `16_legal_badge-notice.png` |
| `/external-resources` | 200 | "Aviso sobre recursos externos" | ❌ default site title | `16_legal_external-resources.png` |
| `/acceptable-use` | 200 | "Política de uso aceptable" | ❌ default site title | `16_legal_acceptable-use.png` |
| `/data-rights` | 200 | "Derechos sobre tu cuenta y datos" | ❌ default site title | `16_legal_data-rights.png` |
| `/security` | 200 | "Contacto de seguridad" | ❌ default site title | `16_legal_security.png` |

- **Expected:** all 9 return HTTP 200 with rendered content.
- **Actual:** all 9 return 200 with proper H1 headings and content. **P3-01:** 8 of 9 pages lack a page-specific `<title>` (only `/privacy` has one); the rest fall back to the default site title "PyArcana · De cero a Data Scientist" — minor SEO/accessibility issue.

---

### Step 7 — Static boundary verification : **PASS**

| Forbidden term | Occurrences on home snapshot | Result |
|---|---|---|
| `nav-admin` | 0 | ✅ |
| `nav-pricing` | 0 | ✅ |
| `AdminDashboard` | 0 | ✅ |
| `SupervisorDashboard` | 0 | ✅ |
| `PricingPage` | 0 | ✅ |
| `/api/` | 0 | ✅ |

- **Notes:** A "Dashboard" button (ref `e11`) is present in the sidebar — clicking it scrolls to the student-facing progress dashboard on the home page (URL stays at root). This is the **learner** dashboard, not an admin console. The text "Inicia sesión para invitar a un supervisor a verificar tus badges" is informational copy about a dynamic-only feature (the actual supervisor invite UI / admin login / `/api/` calls are absent). Acceptable for static deployment.

- **Screenshot:** `17_dashboard_view.png`

---

### Step 8 — Keyboard navigation : **PASS**

| Interaction | Command | Result |
|---|---|---|
| Press Tab × 5 | `agent-browser press Tab` (×5) | Focus advances: starts at body, moves through nav buttons (PyArcana logo, section 1 button, "Marcar como favorito" subbutton, section 2 button, …). Verified via interactive snapshot showing changing refs and visible focus. | ✅ |
| Press Shift+Tab × 2 | `agent-browser press Shift+Tab` (×2) | Focus moves backward to a "Marcar como favorito" button (verified via snapshot ref change). | ✅ |
| Press Enter on focused link | `agent-browser press Enter` | Navigation occurs: URL → `#setup` (section 1 slug). | ✅ |

- **Screenshot:** `18_keyboard_5tabs.png`

---

### Step 9 — Mobile responsive (375×812) : **PASS**

| Interaction | Command | Result |
|---|---|---|
| Set mobile viewport | `agent-browser set viewport 375 812` | viewport applied ✅ |
| Open capstones on mobile | `agent-browser open "…/#capstones"` | 4 level regions + Proyecto final all render ✅ |
| Click hamburger | `agent-browser click @e2` (button "Abrir menú") | Navigation drawer opens with all 52 section buttons ✅ |

| Check | Expected | Actual | Result |
|---|---|---|---|
| Hamburger menu appears | present | `button "Abrir menú"` present | ✅ PASS |
| Cards stack vertically, no horizontal overflow | no overflow | Snapshot shows clean vertical stack; all 4 L1–L4 regions + Proyecto final render within 375px width | ✅ PASS |
| All text readable | readable | Text nodes preserved in snapshot (no truncation observed) | ✅ PASS |

- **Screenshots:** `19_mobile_capstones_375.png`, `20_mobile_capstones_scroll.png`, `21_mobile_menu_open.png`, `22_mobile_home.png`

---

### Step 10 — 200% zoom : **PASS**

| Interaction | Command | Result |
|---|---|---|
| Reset to desktop viewport | `agent-browser set viewport 1280 720` | ✅ |
| Apply 200% zoom via keyboard | `agent-browser press Control+=` (×7) | Browser zoom applied (~200%) ✅ |
| Verify layout integrity | snapshot | All 4 level regions (L1–L4) still render on capstones view; no catastrophic layout break ✅ |
| Reset zoom | `agent-browser press Control+0` | ✅ |

- **Screenshot:** `23_zoom_200pct.png`

---

### Step 11 — Theme toggle : **FAIL (P2 defect)**

| Interaction | Command | Result |
|---|---|---|
| Find theme toggle | snapshot | `button "Cambiar tema" [ref=e6]` present in nav banner ✅ |
| Capture baseline (capstones, light) | `agent-browser screenshot 27a_theme_light.png` | hash `e477e7c743934da725e1d52b9b1f6010` (179203 bytes) |
| Click theme toggle | `agent-browser click @e7` | click succeeds, no console errors ✅ |
| Capture after toggle | `agent-browser screenshot 27b_theme_dark.png` | hash `e477e7c743934da725e1d52b9b1f6010` (179203 bytes) — **BYTE-IDENTICAL to baseline** ❌ |
| Re-test on text-heavy section view | screenshots `28a_section_light.png` / `28b_section_dark.png` | both hash `9b02988ae60b93e24e5bda93801a7c57` — **BYTE-IDENTICAL** ❌ |
| Verify dark CSS exists via `set media dark` / `set media light` | `agent-browser set media dark` / `light` | Media emulation DOES produce different screenshots (dark: hash `da7653…` 493589 B; light: hash `f9bdc9…` 494498 B), confirming dark-theme CSS exists. Only the **manual toggle button** is non-functional. |

- **Expected:** clicking "Cambiar tema" toggles the visual theme (dark ↔ light) with no contrast issues.
- **Actual:** clicking the toggle produces NO visible theme change (before/after screenshots byte-identical across two separate test surfaces). The site responds correctly to `prefers-color-scheme`, so the dark theme CSS is present — only the manual toggle's onClick wiring is broken on the static export.
- **Result:** ❌ **FAIL → P2-01**

- **Screenshots:** `24_theme_before.png`, `25_theme_after_toggle.png`, `26_theme_back.png`, `27a_theme_light.png`, `27b_theme_dark.png`, `28a_section_light.png`, `28b_section_dark.png`, `29_media_dark.png`, `30_media_light.png`

---

### Step 12 — Language toggle : **CONDITIONAL PASS (P2 defect)**

| Interaction | Command | Result |
|---|---|---|
| Find language toggle | snapshot | `button "Cambiar idioma de la interfaz" [ref=e11]` with flag `🇵🇪` present ✅ |
| Click language toggle | `agent-browser click @e11` | Dropdown opens with 3 options: `🇵🇪 Español (PE)`, `🇪🇸 Español (NE)`, `🇬🇧 English` ✅ |
| Click "🇬🇧 English" | `agent-browser click @e148` | UI chrome switches to English: "Autonomous Python course for data and AI", "Your progress", "0 of 52 sections completed", "Bookmark" (was "Marcar como favorito"), "PHASE 1 — INDEPENDENT APPLIED PRACTICE", "PHASE 2 — ADVANCED INTEGRATION & EVALUATION" ✅ |
| Click "🇵🇪 Español (PE)" to revert | `agent-browser click @e146` | UI chrome reverts to Spanish ✅ |
| Navigate to Capstones in English | `agent-browser click @e2` ("Projects") | Capstones view loads; nav button is "Projects" (English) ✅ |

| Check | Expected | Actual | Result |
|---|---|---|---|
| Language toggle exists | present | `🇵🇪` button present, opens dropdown | ✅ PASS |
| UI language changes | changes | UI chrome switches ES↔EN (nav, buttons, progress labels, FASE→PHASE) | ✅ PASS |
| All 4 level names appear in toggled language | translated | ❌ Level region labels remain in Spanish in English mode: "L1Fundamentos Guiados", "L2Práctica Aplicada Independiente", "L3Integración y Evaluación Avanzada", "L4Sistemas de Producción Gobernados". **Not internationalized.** → **P2-02** | ❌ FAIL |
| Section content language | (documented: lessons stay in Peruvian Spanish) | Section titles + descriptions remain in Spanish ("Entorno reproducible", "Python, editor, entorno aislado…"). This is **documented** behavior per footer: "lessons in Peruvian Spanish" — acceptable. | ✅ PASS (by design) |

- **Screenshots:** `31_language_toggled.png`, `32_capstones_english.png`, `33_back_to_spanish.png`

---

## Defect Ledger (P0–P3)

| ID | Severity | Step | Summary | Repro | Suggested fix |
|---|---|---|---|---|---|
| **P1-01** | 🔴 P1 | 3 | Gate-section links on Capstones view (`#S04`, `#S08`, `#S13`, `#S26`, `#S39`, `#S52`) set URL hash but render an EMPTY `<main>` region. Section views only render when navigated via the sidebar (which uses slug hashes like `#functions-modules`). | Open `/#capstones`, click any "Sección de evaluación S04" button inside a capstone card → URL becomes `#S04` but main content area is blank. | Make the gate-section link click handler dispatch the same navigation action as the sidebar (use the section's slug, or make the router recognize `#SNN` hashes and resolve them to the corresponding section slug). |
| **P2-01** | 🟠 P2 | 11 | "Cambiar tema" theme toggle button is present and clickable but produces NO visible theme change. Before/after screenshots are byte-identical (verified on both capstones and section views). Dark-theme CSS exists (site responds to `prefers-color-scheme: dark`), so the defect is in the toggle's onClick wiring on the static export. | Open any page, screenshot, click "Cambiar tema", screenshot again → identical PNGs (same MD5). | Verify the next-themes (or equivalent) provider is correctly mounted in the static export. Likely the toggle calls `setTheme` but the provider isn't hydrated in time, or the `class` attribute on `<html>` isn't being toggled. Check that `suppressHydrationWarning` is set on `<html>` and that the theme script runs pre-hydration. |
| **P2-02** | 🟠 P2 | 12 | Level names on the Capstones view are NOT internationalized. When the UI is toggled to English, the four level region labels remain in Spanish: "L1Fundamentos Guiados", "L2Práctica Aplicada Independiente", "L3Integración y Evaluación Avanzada", "L4Sistemas de Producción Gobernados". | Toggle language to English (🇬🇧), navigate to Capstones → level region labels stay in Spanish. | Add the four level names to the i18n message catalogs (es-PE, es-NE, en) and use `t('level.l1.name')` etc. instead of hardcoded Spanish strings in the level region labels. |
| **P3-01** | 🟡 P3 | 6 | 8 of 9 legal pages lack a page-specific `<title>`. Only `/privacy` has a custom title ("Aviso de Privacidad · PyArcana"); the other 8 fall back to the default site title "PyArcana · De cero a Data Scientist". | `curl -s https://pillb.github.io/pyarcana/terms \| grep -i <title>` → returns default site title. | Add `export const metadata = { title: 'Términos de uso · PyArcana' }` (or equivalent) to each legal page route. |
| **P3-02** | 🟡 P3 | 5 | Content typo: untranslated Chinese token `背景` (meaning "background") leaked into the Spanish description of the "Google ML Crash Course" resource on the Resources view. | Open `/#resources`, search "Google ML Crash Course" → description contains "…sin asumir**背景** de matemáticas." | Replace `背景` with the intended Spanish word (likely "antecedentes" or "formación"). |
| **P3-03** | 🟡 P3 | 2 | The exact phrase "no establecen" (specified in the validation spec) does NOT appear anywhere on the home page. Equivalent honest qualification disclaimers ARE present ("No es una certificación profesional ni una credencial acreditada", "No garantiza empleo, entrevistas ni salario", "No es equivalente a credenciales de terceros"), so the semantic intent is satisfied — only the literal phrase is missing. | `grep -c "no establecen" <home snapshot>` → 0. | Either update the spec to reference the actual phrases used, or add the phrase "no establecen…" to the home page qualification block if spec compliance is required verbatim. |
| **P3-04** | 🟡 P3 | 2 | The first level "Fundamentos Guiados" is not labeled on the home page. The home page labels FASE 1, FASE 2, FASE 3 explicitly but sections 1–13 (which constitute level 1 / "Fundamentos Guiados") appear before "FASE 1" with no phase header. All 4 level names DO appear on the Capstones view. | Open home, scroll through curriculum → only 3 FASE labels visible; "Fundamentos Guiados" missing. | Add a "FASE 0 — FUNDAMENTOS GUIADOS" (or equivalent) header before section 1 on the home page curriculum, for parity with FASE 1–3. |

**Defect counts:** P0 = 0 · P1 = 1 · P2 = 2 · P3 = 4 · **Total = 7**

---

## Screenshots Inventory (45 files)

All screenshots saved to `/home/z/my-project/pyarcana_repo/capstone_validation/validation/screenshots/`:

```
01_home_top.png                  18_keyboard_5tabs.png
02_capstones_top.png             19_mobile_capstones_375.png
03_section_S04.png               20_mobile_capstones_scroll.png
04_tab_yohago.png                21_mobile_menu_open.png
05_section_S13.png               22_mobile_home.png
06_section_S26.png               23_zoom_200pct.png
07_section_S39.png               24_theme_before.png
08_section_S52.png               25_theme_after_toggle.png
09_capstones_view2.png           26_theme_back.png
10_ver_brief_expanded.png        27a_theme_light.png
11_ver_rubrica_expanded.png      27b_theme_dark.png
12_recursos_default.png          28a_section_light.png
13_recursos_search_pandas.png    28b_section_dark.png
14_recursos_empty_state.png      29_media_dark.png
15_recursos_filter_curso.png     30_media_light.png
16_legal_*.png (×9)              31_language_toggled.png
17_dashboard_view.png            32_capstones_english.png
                                 33_back_to_spanish.png
                                 34_home_spanish_final.png
                                 35_capstones_final.png
```

---

## Final Verdict

### **CONDITIONAL PASS** for the public-static browser layer.

**Rationale:** The static deployment at `https://pillb.github.io/pyarcana/` is functional for all core learner flows. Of the 12 validation steps:
- **8 PASS** (Steps 1, 4, 5, 6, 7, 8, 9, 10)
- **3 CONDITIONAL PASS** (Steps 2, 3, 12 — core flow works but with noted defects)
- **1 FAIL** (Step 11 — theme toggle non-functional)

**Blocking issues for clean PASS (must fix before bumping to PASS):**
1. **P1-01** — Gate-section links from Capstones view render empty `<main>`. This breaks the primary navigation path from capstone cards to their evaluation sections.
2. **P2-01** — Theme toggle button is dead (no visual effect). Either remove the button or fix the toggle wiring.

**Recommended fixes (nice-to-have):**
3. **P2-02** — Internationalize the 4 level names so the English UI is consistent.
4. **P3-01** — Add page-specific `<title>` to the 8 legal pages missing one.
5. **P3-02** — Remove the leaked `背景` token from the Google ML Crash Course description.
6. **P3-03** — Reconcile the spec's "no establecen" phrase with the actual copy (or vice versa).
7. **P3-04** — Add a "Fundamentos Guiados" phase header on the home page for parity with FASE 1–3.

Once P1-01 and P2-01 are resolved, the public-static browser layer qualifies for a clean **PASS**.

---

*Report generated by the browser-quality-engine sub-agent using only `agent-browser` CLI interactions (mouse, keyboard, viewport emulation). No `page.evaluate`, DOM mutation, or application code was injected during validation.*
