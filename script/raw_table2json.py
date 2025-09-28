import json

path = "data/raw_table.html"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()


blocks = [block + "</tr>" for block in content.split("</tr>") if block.strip() != ""]
data = []
for block in blocks:
    parts = block.split("<td")
    english = parts[3].split('<div class="eng">')[1].split("</div>")[0].strip()
    japanese = parts[4].split('<div class="jap">')[1].split("</div>")[0].strip()
    data.append({"english": english, "japanese": japanese})

with open("data/vocabulary.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
