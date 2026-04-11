# Economics Simulator Pro

[![QA Status](https://github.com/ranjithvijik/econsim/actions/workflows/qa.yml/badge.svg)](https://github.com/ranjithvijik/econsim/actions)

**Economics Simulator Pro** is a comprehensive, interactive, and serverless web simulator designed to deeply explore both microeconomic and macroeconomic principles. Featuring 78 distinct educational modules, the platform seamlessly connects robust theoretical models with dynamic visualizations and live market data.

Built entirely using Vanilla HTML, CSS, and JavaScript, it acts as a premier teaching tool, allowing users to empirically manipulate exogenous variables and instantly observe shifts in equilibrium states, elasticity, and macroeconomic policy impacts.

---

## 🌟 Core Features

- **78 Interactive Modules**: Comprehensive coverage ranging from foundational Supply & Demand and Elasticity to advanced Game Theory, Externalities, and the Solow Growth Model, encompassing 100% curriculum coverage across Micro and Macro.
- **Real-Time Live Markets Integration**: Fetch live intraday market data (via Yahoo Finance API and CORS proxies) directly into the simulator to test theories against real-world equities and indices without a backend server.
- **Dynamic Visualizations**: Deep integration with `Chart.js` provides immediate, smooth rerendering of complex curves (e.g., AD-AS models, Cost Curves, Cournot Reaction Functions) in response to slider manipulations.
- **Zero-Dependency Architecture**: The frontend is 100% vanilla and serverless, requiring zero build steps to deploy or run locally. Simply open `index.html` in your browser.
- **Modern UI/UX**: Glassmorphism elements, strict Dark/Light mode thematic toggles, and carefully engineered micro-animations ensure an immersive educational experience.
- **Academic Rigor**: Incorporates formulas, KPI metrics, and explicit conceptual linkages matching leading textbooks *(OpenStax, Perloff & Brander)*.

---

## 🏗️ Included Modules

The platform is systematically segmented into comprehensive tracks:

### Microeconomics & Firm Strategy
- **Fundamentals**: Scarcity & Choice, PPF Simulator, Budget Constraint, Opportunity Cost, Utility Maximization, Marginal Decision, Indifference Curves.
- **Market Dynamics**: Supply & Demand Equilibrium, Elasticity (Price, Supply, Cross/Income), Price Controls, Demand Shifter.
- **Production & Costs**: Short-Run Production, Production & Cost Curves, Revenue vs Profit.
- **Market Structures**: Perfect Competition, Monopolies, Monopolistic Competition, Oligopoly (Kinked Demand, Cournot vs Stackelberg, Bertrand Price Competition).
- **Firm Strategy**: Collusion & Cartels, Entry Deterrence, Merger Analysis (HHI), Firm Organization (Make-or-Buy), Corporate Social Responsibility (CSR) & Business Ethics.
- **Labor & Welfare**: Labor Market, MRP Labor, Poverty Calculator, Lorenz Curve, Tax Incidence.

### Game Theory & Information Economics
- **Game Theory Paradigms**: Static & Nash Equilibrium, Sequential Games & Backward Induction, Repeated Games, Mixed Strategy, Coordination Games, Behavioral Game Theory.
- **Information & Risk**: Expected Value, Asymmetric Information, Moral Hazard, Auctions & Bargaining.
- **Market Failure**: Externalities & Market Failure, Public Choice.

### Macroeconomics
- **National Accounting & Indicators**: GDP Calculator, Real vs Nominal GDP, Economic Growth Rate, Unemployment Calculator, Types of Unemployment, CPI Calculator, Purchasing Power.
- **Aggregate Economy**: AD-AS Model, Keynesian Cross, Paradox of Thrift.
- **Fiscal & Monetary Policy**: Fiscal Policy & Multipliers, Monetary Policy Mechanisms, The Phillips Curve, Fractional Reserve Banking, Financial Markets, National Debt.
- **Long-Run Growth**: Solow Growth Model, Productivity Growth.

### International Economics & Globalization
- **Trade**: Comparative Advantage, Balance of Trade, Tariff Simulation, Trade Policy, Intra-Industry Trade.
- **Global Systems**: Exchange Rates, Globalization, Macro Policy Around the World.

---

## 🔌 External APIs & Data Sources

EconSim Pro integrates direct connections to real-world data providers to dynamically adjust curriculum constants, shifting models out of theoretical bounds and into live economic reflection.

### API Keys (GitHub Secrets)
The following keys should be configured as **Environment Variables** or **GitHub Repository Secrets** for automated deployments:
- `FRED_API`: Required for fetching macroeconomic indicators.
- `AV_API_KEY`: Required for fetching Alpha Vantage stock configurations.

### Data Tiers
1. **Tier 1 (Local Servers)**: If a python/flask backend (`http://127.0.0.1:5000/`) is detected on the network, it fetches unfiltered live financial data locally.
2. **Tier 2 (CORS Proxies)**: Securely proxies serverless requests to Yahoo Finance for immediate real-time equity queries without exposing tokens.
3. **Tier 3 (Direct APIs)**: 
   - **Federal Reserve Economic Data (FRED)**: Directly queried mapping 11 global indexes (FEDFUNDS, CPI, UNRATE, 10-Yr Yields, GDP Growth, etc.) via the St. Louis Fed.
   - **Alpha Vantage**: Queried securely to fetch fallback `GLOBAL_QUOTE` financial analytics to fuel microeconomic models (like Dividend Gordon Growth equations and Beta calculations).
4. **Tier 4 (Static Fallback)**: If rate-limits are hit or users run completely offline, the system safely triggers an initialized synthetic fallback simulation dataset dynamically generated in JS to ensure the UI visually succeeds in classroom environments.

---

## 🧪 Automated Testing & QA Pipeline

To ensure the unwavering stability of all educational components, this repository employs a fully offline HTML AST (Abstract Syntax Tree) QA testing framework written in Node.js. It executes in milliseconds without the overhead of a headless browser.

### QA Checks Implemented:
- **`test_html_structure.js`**: Validates base HTML skeleton structure, dependencies, and globals.
- **`test_modules.js`**: Validates the presence of all 78 modules, sub-titles, and academic source tags.
- **`test_components.js`**: Asserts that all functional UI items (such as `<input type="range">` sliders, KPI cards, and `<canvas>` graph targets) are strictly maintained.

### Running QA Locally
If you have Node.js 18+ installed on your machine:
```bash
# Install the light-weight DOM parser dependency
make install

# Execute the QA suite and generate QA-REPORT.md
make qa
```
*Note: The QA-REPORT.md is dynamically overwritten on each run, providing an exact letter grade and specific module failure traces.*

### CI/CD Deployment
The repository includes integrated GitHub Actions (`qa.yml` and `deploy.yml`) as well as AWS Amplify (`amplify.yml`) instructions. The QA suite automatically runs on every push or Pull Request, blocking broken code from deploying.

---

## 🚀 Getting Started

Since the simulator operates purely client-side, deployment and usage are frictionless.

1. **Locally**: Clone the repo and open `index.html` in any modern web browser.
2. **Hosting**: Drag and drop the repository root directly into Vercel, Netlify, GitHub Pages, or AWS Amplify. No build command is required for the static frontend.

## 📄 License
This project is for educational simulation and empirical economic analysis. 
