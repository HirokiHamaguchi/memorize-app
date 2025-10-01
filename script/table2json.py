import glob
import json
import os
import re
import time

import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/117.0.0.0 Safari/537.36"
}


def clean_japanese_text(text):
    """日本語テキストから不要なHTMLタグを除去"""
    # <font style="...">(...)</font> パターンを除去
    cleaned = re.sub(r"<font[^>]*>.*?</font>", "", text)
    return cleaned.strip()


def check_cambridge_url(word):
    time.sleep(0.1)  # Be polite to the server
    url = f"https://dictionary.cambridge.org/ja/dictionary/english-japanese/{word}"
    response = requests.head(url, headers=headers)
    print(f"Checked {url}: {response.status_code}")
    # todo: collect necessary data from the page


def process_html_file(html_path):
    """HTMLファイルを処理してJSONデータを生成"""
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    blocks = [
        block + "</tr>" for block in content.split("</tr>") if block.strip() != ""
    ]
    data = []

    for i, block in enumerate(blocks, start=1):
        parts = block.split("<td")
        english = parts[3].split('<div class="eng">')[1].split("</div>")[0].strip()
        japanese = parts[4].split('<div class="jap">')[1].split("</div>")[0].strip()

        japanese = clean_japanese_text(japanese)

        data.append({"id": i, "en": english, "ja": japanese})

    return data


# data/以下のraw_table_*.htmlファイルを検索
html_files = glob.glob("src/data/raw/table_*.html")

if not html_files:
    print("data/以下にraw_table_*.htmlファイルが見つかりませんでした。")
else:
    print(f"見つかったHTMLファイル: {html_files}")

    for html_path in html_files:
        basename = os.path.basename(html_path)
        suffix = basename.replace("table_", "").replace(".html", "")
        json_filename = f"src/data/vocabulary/vocabulary_{suffix}.json"
        data = process_html_file(html_path)
        with open(json_filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"完了: {len(data)}件のデータを{json_filename}に保存しました。")

print("全ての処理が完了しました。")
