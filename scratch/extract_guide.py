import bs4
import json

with open("index.html", "r", encoding="utf-8") as f:
    soup = bs4.BeautifulSoup(f, "html.parser")

sections = soup.find_all("section", class_="section")
guide_data = []

for s in sections:
    sec_id = s.get("id")
    title = s.find("h2", class_="section-title")
    title_text = title.text.strip() if title else sec_id
    
    subtitle = s.find("p", class_="section-subtitle") or s.find("div", class_="section-subtitle")
    subtitle_text = subtitle.text.strip() if subtitle else ""
    
    # Sliders / Inputs
    sliders = []
    labels = s.find_all("span", class_="slider-label-text")
    for l in labels:
        sliders.append(l.text.strip())
        
    # Insights / Theory
    insights = []
    for insight in s.find_all("div", class_="insight-card"):
        txt = insight.text.strip()
        if txt: insights.append(txt)
        
    guide_data.append({
        "id": sec_id,
        "title": title_text,
        "subtitle": subtitle_text,
        "parameters": sliders,
        "theory": " ".join(insights)[:200] + "..." if insights else ""
    })

print(f"Extracted {len(guide_data)} modules")
with open("scratch/guide_preview.json", "w") as out:
    json.dump(guide_data[:3], out, indent=2)
