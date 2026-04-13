# EconSim — QA Report

> Generated: **2026-04-13 00:53 UTC**  |  Grade: **A+**  |  Pass Rate: **100.0%**

## 🟢 ALL TESTS PASSED

| Metric | Value |
|--------|-------|
| Total Tests | **42** |
| Passed      | ✅ 42 |
| Failed      | ✅ 0 |
| Pass Rate   | 100.0% `██████████████████████████████` |
| Duration    | ⏱️ 0.20s |
| Grade       | **A+** |

## 🧪 Test Modules

| Module | Description | Tests | Passed | Failed | Status |
|--------|-------------|-------|--------|--------|--------|
| `tests/unit/test_html_structure.js` | Validates raw HTML integrity, essential tags, globals, and structural invariants. | 7 | 7 | 0 | ✅ |
| `tests/unit/test_modules.js` | Validates all 78 economic modules. | 9 | 9 | 0 | ✅ |
| `tests/unit/test_components.js` | Validates sliders, KPI readouts, formulas, charts, and JS functions for all 63 modules. | 10 | 10 | 0 | ✅ |
| `tests/unit/test_guide_structure.js` | Validates econsimguide.html structure, theme wiring, navigation, and DOM layout (sidebar + single main column). | 13 | 13 | 0 | ✅ |
| `tests/unit/test_deploy_config.js` | Ensures Amplify ships all static pages and cross-links stay wired. | 3 | 3 | 0 | ✅ |

## 📋 Detailed Test Results

### HTML Structure & Health
**File:** `tests/unit/test_html_structure.js` &nbsp;|&nbsp; **Status:** ✅ PASSED &nbsp;|&nbsp; **7/7 tests passing**

<details>
<summary>Show all tests</summary>

| Test | Description | Status |
|------|-------------|--------|
| `Single <html> and <body>` | Single <html> and <body> | ✅ PASSED |
| `Title element is present and correct` | Title element is present and correct | ✅ PASSED |
| `Layout classes present` | Layout classes present | ✅ PASSED |
| `Script dependencies present` | Script dependencies present | ✅ PASSED |
| `Light mode defaults` | Light mode defaults | ✅ PASSED |
| `Section tags balanced in index.html` | Section tags balanced in index.html | ✅ PASSED |
| `Student Guide href from simulator` | Student Guide href from simulator | ✅ PASSED |

</details>

### Simulator Modules & Sections
**File:** `tests/unit/test_modules.js` &nbsp;|&nbsp; **Status:** ✅ PASSED &nbsp;|&nbsp; **9/9 tests passing**

<details>
<summary>Show all tests</summary>

| Test | Description | Status |
|------|-------------|--------|
| `Nav items present (78 modules)` | Nav items present (78 modules) | ✅ PASSED |
| `All section titles exist (78 total)` | All section titles exist (78 total) | ✅ PASSED |
| `Live Markets section exists` | Live Markets section exists | ✅ PASSED |
| `Original 26 modules present` | Original 26 modules present | ✅ PASSED |
| `Wave 1 Fundamentals & Macro modules present` | Wave 1 Fundamentals & Macro modules present | ✅ PASSED |
| `Wave 2 Keynesian, Production & Welfare modules present` | Wave 2 Keynesian, Production & Welfare modules present | ✅ PASSED |
| `Wave 3 Advanced & International modules present` | Wave 3 Advanced & International modules present | ✅ PASSED |
| `Section subtitles present` | Section subtitles present | ✅ PASSED |
| `Source tags exist throughout` | Source tags exist throughout | ✅ PASSED |

</details>

### Interactive Components & KPIs
**File:** `tests/unit/test_components.js` &nbsp;|&nbsp; **Status:** ✅ PASSED &nbsp;|&nbsp; **10/10 tests passing**

<details>
<summary>Show all tests</summary>

| Test | Description | Status |
|------|-------------|--------|
| `Interactive Sliders (50+)` | Interactive Sliders (50+) | ✅ PASSED |
| `Chart Canvas Elements (12+)` | Chart Canvas Elements (12+) | ✅ PASSED |
| `KPI Cards (40+)` | KPI Cards (40+) | ✅ PASSED |
| `Formula Blocks (20+)` | Formula Blocks (20+) | ✅ PASSED |
| `Result Boxes (25+)` | Result Boxes (25+) | ✅ PASSED |
| `Core JS Functions (Wave 1)` | Core JS Functions (Wave 1) | ✅ PASSED |
| `Core JS Functions (Wave 2)` | Core JS Functions (Wave 2) | ✅ PASSED |
| `Interactive Buttons` | Interactive Buttons | ✅ PASSED |
| `Navigation and theme controllers` | Navigation and theme controllers | ✅ PASSED |
| `Macro update functions present` | Macro update functions present | ✅ PASSED |

</details>

### Student Guide HTML
**File:** `tests/unit/test_guide_structure.js` &nbsp;|&nbsp; **Status:** ✅ PASSED &nbsp;|&nbsp; **13/13 tests passing**

<details>
<summary>Show all tests</summary>

| Test | Description | Status |
|------|-------------|--------|
| `Single document shell` | Single document shell | ✅ PASSED |
| `Title and fonts` | Title and fonts | ✅ PASSED |
| `Light theme default on <html>` | Light theme default on <html> | ✅ PASSED |
| `Layout and navigation present` | Layout and navigation present | ✅ PASSED |
| `Theme persistence (setTheme + localStorage)` | Theme persistence (setTheme + localStorage) | ✅ PASSED |
| `Guide content pages present` | Guide content pages present | ✅ PASSED |
| `Light-mode readability tokens` | Light-mode readability tokens | ✅ PASSED |
| `Sidebar nav order matches simulator (index.html) order` | Sidebar nav order matches simulator (index.html) order | ✅ PASSED |
| `Guide body page ids follow same order as sidebar (mf1 … mx4)` | Guide body page ids follow same order as sidebar (mf1 … mx4) | ✅ PASSED |
| `DOM: app-wrapper contains only sidebar + main-content (flex row)` | DOM: app-wrapper contains only sidebar + main-content (flex row) | ✅ PASSED |
| `DOM: no .page directly under .app-wrapper (stray closing div)` | DOM: no .page directly under .app-wrapper (stray closing div) | ✅ PASSED |
| `DOM: every .page section is inside .main-content` | DOM: every .page section is inside .main-content | ✅ PASSED |
| `DOM: key anchors (#mp3, #m05, #references) under .main-content` | DOM: key anchors (#mp3, #m05, #references) under .main-content | ✅ PASSED |

</details>

### Deploy & Project Config
**File:** `tests/unit/test_deploy_config.js` &nbsp;|&nbsp; **Status:** ✅ PASSED &nbsp;|&nbsp; **3/3 tests passing**

<details>
<summary>Show all tests</summary>

| Test | Description | Status |
|------|-------------|--------|
| `Amplify artifacts include simulator and guide` | Amplify artifacts include simulator and guide | ✅ PASSED |
| `Index links to Student Guide` | Index links to Student Guide | ✅ PASSED |
| `Package scripts invoke QA runner` | Package scripts invoke QA runner | ✅ PASSED |

</details>

## 🚀 Running the Tests

### Quick start
```bash
npm install
node run_tests.js
```

### Options
```bash
node run_tests.js --fast                   # skip live-data tests
node run_tests.js --module guide_structure  # run only that module
node run_tests.js --out my_qa.md            # custom output path
node run_tests.js --no-report              # run without writing file
```

### Makefile shortcuts
```bash
make qa              # full suite + QA-REPORT.md
make test            # verbose run
make fast            # skip live-data
make t-html          # HTML structure only
make t-guide         # Student Guide HTML only
make t-deploy        # Amplify + package wiring only
make clean           # remove QA-REPORT.md
```

## 🏗️ Test Architecture

```
tests/
├── helpers.js                         # Shared utilities (getHTML, assert, etc.)
│
└── unit/
    ├── test_html_structure.js         # index.html shell, sections, links
    ├── test_modules.js                # All 78 module section ids
    ├── test_components.js             # Sliders, charts, key JS handlers
    ├── test_guide_structure.js        # econsimguide.html layout & theme
    └── test_deploy_config.js          # amplify.yml artifacts, npm scripts
```

All tests run **fully offline** — no network calls, no browser, no server.
Tests parse `index.html` directly as a text file using Node.js `fs`.

---
*Generated by `run_tests.js` · 2026-04-13 00:53 UTC*
