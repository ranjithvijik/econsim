import os

file_path = '/Users/ranjith/Desktop/UB/econsim/index.html'

with open(file_path, 'r') as f:
    lines = f.readlines()

functions_to_inject = """
        let asymInfoChartInstance;
        function renderAsymInfoChart(prob, vGood, vLemon) {
            const ctx = document.getElementById('asymInfoChart'); if (!ctx) return;
            const col = getChartColors();
            if (asymInfoChartInstance) asymInfoChartInstance.destroy();
            asymInfoChartInstance = new Chart(ctx, {
                type: 'bar', data: { labels: ['Value (Good)', 'Value (Lemon)', 'Expected Value'], datasets: [{ data: [vGood, vLemon, prob*vGood + (1-prob)*vLemon], backgroundColor: [col.teal, col.gold, col.purple], borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } }
            });
        }

        let moralHazardChartInstance;
        function renderMoralHazardChart(base, bonus, cost) {
            const ctx = document.getElementById('moralHazardChart'); if (!ctx) return;
            const col = getChartColors();
            if (moralHazardChartInstance) moralHazardChartInstance.destroy();
            moralHazardChartInstance = new Chart(ctx, {
                type: 'bar', data: { labels: ['Utility (Effort)', 'Utility (Shirk)'], datasets: [{ data: [(base+bonus)-cost, base], backgroundColor: [col.teal, col.gold], borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } }
            });
        }

        let publicChoiceChartInstance;
        function renderPublicChoiceChart(lobby, voters) {
            const ctx = document.getElementById('publicChoiceChart'); if (!ctx) return;
            const col = getChartColors();
            if (publicChoiceChartInstance) publicChoiceChartInstance.destroy();
            publicChoiceChartInstance = new Chart(ctx, {
                type: 'bar', data: { labels: ['Lobbying Cost', 'Special Interest Gain', 'Social Cost (DWL)'], datasets: [{ data: [lobby, lobby*5, lobby*5*voters], backgroundColor: [col.red, col.teal, col.gold], borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } }
            });
        }

        let exchangeRateChartInstance;
        function renderExchangeRateChart(rate, trade) {
            const ctx = document.getElementById('exchangeRateChart'); if (!ctx) return;
            const col = getChartColors();
            if (exchangeRateChartInstance) exchangeRateChartInstance.destroy();
            exchangeRateChartInstance = new Chart(ctx, {
                type: 'line', data: { labels: ['-2%', '-1%', 'Base', '+1%', '+2%'], datasets: [{ label: 'Currency Value', data: [0.95, 0.98, 1.0 + (rate-5)/100 + trade/1000, 1.05, 1.1], borderColor: col.teal, fill: true, backgroundColor: 'rgba(0,180,216,0.1)' }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0.8, max: 1.2, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } }
            });
        }

        let creditMarketChartInstance;
        function renderCreditMarketChart(r, q) {
            const ctx = document.getElementById('creditMarketChart'); if (!ctx) return;
            const col = getChartColors();
            if (creditMarketChartInstance) creditMarketChartInstance.destroy();
            creditMarketChartInstance = new Chart(ctx, {
                type: 'bar', data: { labels: ['Interest Rate (%)', 'Equilibrium Credit ($B)'], datasets: [{ data: [r, q/10], backgroundColor: [col.teal, col.gold], borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } }
            });
        }

        let utilityMaxChartInstance;
        function renderUtilityMaxChart(mux, muy) {
            const ctx = document.getElementById('utilityMaxChart'); if (!ctx) return;
            const col = getChartColors(); if (utilityMaxChartInstance) utilityMaxChartInstance.destroy();
            utilityMaxChartInstance = new Chart(ctx, { type: 'bar', data: { labels: ['MUx/Px', 'MUy/Py'], datasets: [{ data: [parseFloat(mux)||0, parseFloat(muy)||0], backgroundColor: [col.teal, col.gold], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } } });
        }

        let perfCompChartInstance;
        function renderPerfCompChart(p, atc, mc) {
            const ctx = document.getElementById('perfCompChart'); if (!ctx) return;
            const col = getChartColors(); if (perfCompChartInstance) perfCompChartInstance.destroy();
            perfCompChartInstance = new Chart(ctx, { type: 'bar', data: { labels: ['Price', 'ATC', 'MC'], datasets: [{ data: [p, atc, mc], backgroundColor: [col.teal, col.red, col.gold], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } } });
        }

        let monopCompChartInstance;
        function renderMonopCompChart(p, q, pi) {
            const ctx = document.getElementById('monopCompChart'); if (!ctx) return;
            const col = getChartColors(); if (monopCompChartInstance) monopCompChartInstance.destroy();
            monopCompChartInstance = new Chart(ctx, { type: 'bar', data: { labels: ['Price', 'Quantity (x10)', 'Profit (x10)'], datasets: [{ data: [p, q*10, pi/10], backgroundColor: [col.teal, col.gold, col.green], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } } });
        }

        let kinkedDemandChartInstance;
        function renderKinkedDemandChart(mrA, mrB, mc) {
            const ctx = document.getElementById('kinkedDemandChart'); if (!ctx) return;
            const col = getChartColors(); if (kinkedDemandChartInstance) kinkedDemandChartInstance.destroy();
            kinkedDemandChartInstance = new Chart(ctx, { type: 'bar', data: { labels: ['MR (Above)', 'Marginal Cost', 'MR (Below)'], datasets: [{ data: [mrA, mc, mrB], backgroundColor: [col.teal, col.red, col.gold], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text } }, x: { ticks: { color: col.text } } } } });
        }

        let povertyGapChartInstance;
        function renderPovertyGapChart(inc, thresh) {
            const ctx = document.getElementById('povertyGapChart'); if (!ctx) return;
            const col = getChartColors(); if (povertyGapChartInstance) povertyGapChartInstance.destroy();
            povertyGapChartInstance = new Chart(ctx, { type: 'bar', data: { labels: ['Annual Income', 'Poverty Threshold'], datasets: [{ data: [inc, thresh], backgroundColor: [col.red, col.teal], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: col.text, callback: v => '$' + v.toLocaleString() } }, x: { ticks: { color: col.text } } } } });
        }

        let unemploymentTrendChartInstance;
        function renderUnemploymentTrendChart() {
            const ctx = document.getElementById('unemploymentTrendChart'); if (!ctx) return;
            const col = getChartColors(); if (unemploymentTrendChartInstance) unemploymentTrendChartInstance.destroy();
            unemploymentTrendChartInstance = new Chart(ctx, { type: 'doughnut', data: { labels: ['Frictional', 'Structural', 'Cyclical', 'Seasonal'], datasets: [{ data: [3.2, 4.1, 1.5, 0.8], backgroundColor: [col.teal, col.gold, col.red, col.purple] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: col.text } } } } });
        }

        let productivityChartInstance;
        function renderProductivityChart(cap, lab) {
            const ctx = document.getElementById('productivityChart'); if (!ctx) return;
            const col = getChartColors(); if (productivityChartInstance) productivityChartInstance.destroy();
            productivityChartInstance = new Chart(ctx, { type: 'bar', data: { labels: ['Capital Contribution', 'Labor Contribution'], datasets: [{ data: [cap, lab], backgroundColor: [col.gold, col.green], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: col.text, callback: v => v + '%' } }, x: { ticks: { color: col.text } } } } });
        }
"""

with open(file_path, 'w') as f:
    for line in lines:
        if 'function refreshAllCharts()' in line:
            f.write(functions_to_inject)
        f.write(line)
