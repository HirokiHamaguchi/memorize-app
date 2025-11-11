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

# セクション数の定数
SECTIONS_COUNT = 50


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


def split_data_into_sections(data, sections_count):
    """データをセクションに分割する

    Args:
        data: 全データのリスト
        sections_count: セクション数

    Returns:
        セクションごとのデータを含む辞書 {section_num: [data_items]}
    """
    sections = {i: [] for i in range(1, sections_count + 1)}

    for index, item in enumerate(data):
        section_num = (index % sections_count) + 1
        sections[section_num].append(item)

    return sections


# data/以下のraw_table_*.htmlファイルを検索
html_files = glob.glob("src/data/vocabulary/raw/table_*.html")

if not html_files:
    print("data/以下にraw_table_*.htmlファイルが見つかりませんでした。")
else:
    print(f"見つかったHTMLファイル: {html_files}")

    for html_path in html_files:
        basename = os.path.basename(html_path)
        suffix = basename.replace("table_", "").replace(".html", "")

        # 全データを処理
        all_data = process_html_file(html_path)
        print(f"処理完了: {len(all_data)}件のデータを取得しました。")

        # セクションごとに分割
        sections = split_data_into_sections(all_data, SECTIONS_COUNT)

        # セクションごとにJSONファイルを生成
        for section_num, section_data in sections.items():
            if section_data:  # データが存在する場合のみ保存
                json_filename = (
                    f"src/data/vocabulary/vocabulary_{suffix}_section{section_num}.json"
                )
                with open(json_filename, "w", encoding="utf-8") as f:
                    json.dump(section_data, f, ensure_ascii=False, indent=2)
                print(
                    f"  セクション{section_num}: {len(section_data)}件のデータを{json_filename}に保存しました。"
                )


print("全ての処理が完了しました。")
