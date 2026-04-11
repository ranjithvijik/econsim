import os

file_path = '/Users/ranjith/Desktop/UB/econsim/index.html'

with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    
    # 1. Kinked Demand
    if 'id="kd-sticky"' in line:
        # Search for the next </div>\n  </div>\n</section>
        pass # Handle differently: search for the next </section> and insert before it
    
# Actually, let's just use unique markers from the view_file output
patches = {
    '✓ Price is STICKY': """    <div class="chart-card" style="margin-top:16px;"><div class="chart-title">Kinked Demand Curve</div><div class="chart-subtitle">Marginal Revenue gap and price rigidity</div><div class="chart-wrap h-280"><canvas id="kinkedDemandChart"></canvas></div></div>\n""",
    'Both metrics matter.</p>': """  <div class="chart-card" style="margin-top:16px;"><div class="chart-title">Poverty Gap Analysis</div><div class="chart-subtitle">Income vs Poverty Threshold relative to family size</div><div class="chart-wrap h-280"><canvas id="povertyGapChart"></canvas></div></div>\n""",
    'id="unemp-scenarios"': """  <div class="chart-card" style="margin-top:16px;"><div class="chart-title">Unemployment Trends</div><div class="chart-subtitle">Historical breakdown of unemployment types</div><div class="chart-wrap h-280"><canvas id="unemploymentTrendChart"></canvas></div></div>\n""",
    'id="pg-lab-contrib"': """  <div class="chart-card" style="margin-top:16px;"><div class="chart-title">Growth Accounting: Input Contribution</div><div class="chart-subtitle">Technology (teal), Capital (gold), and Labor (green)</div><div class="chart-wrap h-280"><canvas id="productivityChart"></canvas></div></div>\n"""
}

# Special handling for markers that are in the middle of a section, we want to insert before the </section>
# But wait, looking at the view_file, the markers I chose are near the end.

# Let's just do a simple string replacement for the end-of-section patterns that I now know are there.
# I'll use the unique parts of the results boxes.

final_lines = []
for i, line in enumerate(lines):
    final_lines.append(line)
    if 'id="kd-sticky"' in line:
        # Find next </section> and insert before
        for j in range(i+1, i+10):
            if '</section>' in lines[j]:
                lines[j] = patches['✓ Price is STICKY'] + lines[j]
                break
    if 'Both metrics matter.' in line:
        for j in range(i+1, i+10):
            if '</section>' in lines[j]:
                lines[j] = patches['Both metrics matter.</p>'] + lines[j]
                break
    if 'id="unemp-scenarios"' in line:
        for j in range(i+1, i+20):
            if '</section>' in lines[j]:
                lines[j] = patches['id="unemp-scenarios"'] + lines[j]
                break
    if 'id="pg-lab-contrib"' in line:
        for j in range(i+1, i+10):
            if '</section>' in lines[j]:
                lines[j] = patches['id="pg-lab-contrib"'] + lines[j]
                break

with open(file_path, 'w') as f:
    f.writelines(lines)
