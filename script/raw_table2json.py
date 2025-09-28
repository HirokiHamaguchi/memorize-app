import json
import time

import requests

path = "data/raw_table.html"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

blocks = [block + "</tr>" for block in content.split("</tr>") if block.strip() != ""]
data = []

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/117.0.0.0 Safari/537.36"
}


def check_cambridge_url(word):
    time.sleep(0.1)  # Be polite to the server
    url = f"https://dictionary.cambridge.org/ja/dictionary/english-japanese/{word}"
    response = requests.head(url, headers=headers)
    print(f"Checked {url}: {response.status_code}")
    # todo: collect necessary data from the page


for i, block in enumerate(blocks, start=1):
    parts = block.split("<td")
    english = parts[3].split('<div class="eng">')[1].split("</div>")[0].strip()
    japanese = parts[4].split('<div class="jap">')[1].split("</div>")[0].strip()
    data.append({"id": i, "en": english, "ja": japanese})

with open("data/vocabulary.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
