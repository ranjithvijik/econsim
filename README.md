# Economics Simulator (EconSim)

[![QA Status](https://github.com/ranjithvijik/econsim/actions/workflows/qa.yml/badge.svg)](https://github.com/ranjithvijik/econsim/actions)

**EconSim** is a client-side economics simulator: **78 interactive modules** covering microeconomics, macroeconomics, game theory, and applied topics. It pairs algebraic and graphical models with **Chart.js** visualizations, optional **live market** and **macro indicator** data, and a long-form **Student Guide** aligned with leading textbooks.

There is **no build step** for the app itself—open `index.html` in a browser or deploy the static files anywhere.

---

## Features

- **78 modules** — Supply & demand through AD–AS, game theory, externalities, banking, trade, globalization, and more (see in-app navigation).
- **Student Guide** — `econsimguide.html`, also served as `/econsimguide/` on AWS Amplify (see [Deployment](#deployment)).
- **Course alignment** — In-app **course topic → simulator** table mapping typical syllabus units (including common micro/macro chapter themes + managerial-style topics) to modules; deep links use `index.html#section-id`.
- **Other academic references** — Perloff & Brander (*Managerial Economics and Strategy*) and embedded “source” tags on many sections.
- **Themes** — Light/dark UI with persistent preference.
- **Charts** — Chart.js (CDN) for curves, bars, and dashboards that update from sliders and inputs.
- **Data tiers** — Demo/synthetic data by default; optional local Python API, CORS proxies, **FRED** (primary macro), **Yahoo Finance** (default quotes), **Alpha Vantage** fallback, and static demo when sources fail.
- **Live data in the UI** — Macro and market **refresh timestamps** appear in the top bar and section footers so you can see when indicators and quotes were last updated.
- **Cross-module wiring** — FRED-style macro series and the selected equity quote feed **slider defaults and context** across many tools (micro through macro): e.g. supply/demand, AD–AS, fiscal/monetary/Phillips/Solow, IS–LM, Taylor rule, GDP/CPI/unemployment calculators, credit and labor markets, Keynesian cross, loanable funds (risk premium from **beta**), and more. Use **Apply to All Modules** in Live Markets, or refresh macro data from the FRED card.
- **Embed-friendly API** — After load, `window.EconSim` exposes read-only helpers and a one-call refresh:
  - `getMacroSeries()` — shallow copy of current macro indicator object
  - `getMacroPolicy()`, `getMacroRegime()`, `getYieldSpread()` — derived policy hints
  - `getMarketQuote()` — `{ symbol, quote }` for the ticker in the UI
  - `applyLiveDataToModules()` — re-runs the same propagation as the live-data controls

---

## Repository layout

| Path | Purpose |
|------|---------|
| `index.html` | Main simulator (all sections injected by JS). |
| `econsimguide.html` | Printable Student Guide (standalone HTML + CSS). |
| `run_tests.js` | Node test orchestrator; writes `QA-REPORT.md`. |
| `tests/unit/` | HTML structure, modules, components, guide, deploy config tests. |
| `amplify.yml` | AWS Amplify build (guide URL, API key injection, security headers). |
| `.github/workflows/` | **QA** on push/PR; **deploy** workflow on `main` injects API keys, copies the guide to `econsimguide/index.html`, and uploads a `site` build artifact. |

---

## Quick start (local)

1. Clone the repository.
2. Open **`index.html`** in a modern browser (Chrome, Firefox, Safari, Edge).

Optional: serve over HTTP for stricter browser behavior:

```bash
npx --yes serve -p 8080
# Then open http://localhost:8080/index.html
```

Open the guide directly with **`econsimguide.html`** or, after Amplify-style copy, **`econsimguide/index.html`**.

---

## Testing and QA

Tests are **Node.js** checks against the HTML/JS (no headless browser). **Node 18+** required.

```bash
npm install          # installs devDependency node-html-parser
npm test             # full suite → QA-REPORT.md
npm run test:fast    # skip slower checks if supported
```

Equivalent **Makefile** targets: `make install`, `make qa`, `make fast`, `make t-html`, `make t-modules`, `make t-components`, `make t-guide`, `make t-deploy`.

Suite overview:

| Module | Role |
|--------|------|
| `html_structure` | Document shell, layout, Student Guide link pattern. |
| `simulator_modules` | Section IDs and module metadata. |
| `interactive_components` | Sliders, KPIs, canvases, etc. |
| `guide_structure` | Student Guide DOM and navigation. |
| `deploy_config` | `amplify.yml` and deploy expectations. |

CI runs **`qa.yml`** on push/PR; see the badge at the top of this file.

---

## Deployment

- **Static hosts** — Upload the repo root (or `index.html` + assets as your host requires). No compile step.
- **AWS Amplify** — See `amplify.yml`: injects `AV_API_KEY` and `FRED_API` into `index.html` (replacing placeholders), copies `econsimguide.html` to **`econsimguide/index.html`** so **`/econsimguide/`** resolves, and sets security/cache headers for HTML.
- **GitHub Actions** — On push to **`main`**, `.github/workflows/deploy.yml` runs the same placeholder replacement (repository secrets `AV_API_KEY` and `FRED_API`), prepares **`econsimguide/index.html`**, and uploads the **`site`** artifact for download or downstream hosting.

Configure secrets in Amplify and/or GitHub for live FRED / Alpha Vantage usage. The UI still runs with **demo data** if keys are missing.

**Local / static hosting:** Open **Real-Time Market Data** in the app and paste a [free FRED API key](https://fred.stlouisfed.org/docs/api/api_key.html); it is stored in the browser (`localStorage`) and overrides the build-time placeholder when set.

---

## External APIs (optional)

| Secret / env | Use |
|--------------|-----|
| `FRED_API` | St. Louis Fed macro series (build-time `sed` replaces `__FRED_API_KEY__` inside `FRED_API_KEY_BUILD` in `index.html`). |
| `BEA_API` | Bureau of Economic Analysis API key (NIPA trade and tariff table pulls; replaces `__BEA_API_KEY__`). |
| `AV_API_KEY` | Alpha Vantage quotes (fallback when Yahoo or local API is unavailable). |

Python mirror dependency: `world-bank-data` is included for World Bank annual trade indicator fallback in Streamlit deployments.
Streamlit also prefetches World Bank Data360 API trade indicators (`WB_WDI` dataset) and uses them as first annual fallback for trade openness when BEA/FRED are unavailable.

**Market data order of attempt:** Yahoo Finance (via CORS proxies) → Alpha Vantage → optional local Python server → static/demo symbols. **Macro:** FRED when the key is present; yields can be supplemented from market proxies when series are missing.

The code falls back to **synthetic/demo** stocks and baseline macro values when APIs are unavailable or rate-limited.

---

## License and attribution

This project is for **education and research**. Third-party textbook excerpts and attributions in the HTML follow their respective licenses (notably **OpenStax**, CC BY 4.0). Do not remove attribution blocks when redistributing derived materials.

---

## Acknowledgments

- **OpenStax** — *Principles of Microeconomics 3e* & *Principles of Macroeconomics 3e* (Rice University; CC BY 4.0).
- **Perloff & Brander** — *Managerial Economics and Strategy* (Pearson), referenced where noted in the UI.
