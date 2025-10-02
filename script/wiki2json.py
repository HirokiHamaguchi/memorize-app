import json
import os
import re
import time

import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/117.0.0.0 Safari/537.36"
}


def fetch_page_images(id: int, ja: str, iso: str, url: str):
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    img_tags = soup.find_all("img")

    pos = None
    flag = None

    if iso == "EH":
        pos = r"//upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sahrawi_Arab_Democratic_Republic_in_Africa_%28claimed%29.svg/250px-Sahrawi_Arab_Democratic_Republic_in_Africa_%28claimed%29.svg.png"
        flag = "なし(西サハラ)"

    if iso == "PS":
        pos = r"//upload.wikimedia.org/wikipedia/commons/thumb/6/69/BritishMandatePalestine1920.png/250px-BritishMandatePalestine1920.png"
        flag = "なし(パレスチナ)"

    if iso == "BV":
        pos = r"//upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bouvet-pos.png/250px-Bouvet-pos.png"
        flag = r"//upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/250px-Flag_of_Norway.svg.png"

    for img in img_tags[:30]:
        alt_text = str(img.get("alt", ""))
        src = str(img.get("src", ""))
        if pos is None and (
            alt_text.endswith("の位置")
            or alt_text.endswith("の位置図")
            or "on_the_globe" in src
            or "in_the_world" in src
            or "Location" in src
            or "Taiwan2014.svg" in src
        ):
            pos = src
            print(f"位置画像: {alt_text}")
        elif flag is None and "Flag_of" in src:
            flag = src
            print(f"国旗画像: {alt_text}")

    assert pos is not None, f"位置画像が見つかりません: {iso} - {url}"
    assert flag is not None, f"国旗が見つかりません: {iso} - {url}"

    if "/thumb/" in pos and pos.endswith(".svg.png"):
        pos2 = pos.replace("/thumb/", "/").rsplit("/", 1)[0]
        if (
            pos2.endswith(".svg")
            and requests.get(
                url="https:" + pos2, headers=headers, timeout=10
            ).status_code
            == 200
        ):
            pos = pos2
        else:
            assert False, f"SVG画像が見つかりません: {pos2}"
    if "/thumb/" in flag and flag.endswith(".svg.png"):
        flag2 = flag.replace("/thumb/", "/").rsplit("/", 1)[0]
        if (
            flag2.endswith(".svg")
            and requests.get(
                url="https:" + flag2, headers=headers, timeout=10
            ).status_code
            == 200
        ):
            flag = flag2
        else:
            assert False, f"SVG画像が見つかりません: {flag2}"

    return {
        "id": id,
        "ja": ja,
        "iso": iso,
        "url": url.replace("https://ja.wikipedia.org/wiki/", ""),
        "flag": flag,
        "pos": pos,
    }


def process_html_file(html_path, json_path):
    """HTMLファイルを処理してJSONデータを生成"""
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    soup = BeautifulSoup(content, "html.parser")

    # 全ての<tr>タグを取得
    tr_tags = soup.find_all("tr")

    data = []

    for id, tr in enumerate(tr_tags, start=1):
        td_tags = tr.find_all("td")

        assert len(td_tags) >= 6, "tdタグが6つ未満です。"

        # 1つ目のtdからhref属性を取得
        first_td = td_tags[0]
        last_a = first_td.find_all("a")[-1]  # 最後のaタグを取得
        href = last_a.get("href") if last_a else None

        # 1つ目のtdの文字部分を取得
        ja = first_td.get_text().strip()

        # 6つ目のtdから2文字のISOコードを取得
        sixth_td = td_tags[5]
        code_tag = sixth_td.find("code")
        iso_code = code_tag.get_text().strip() if code_tag else None

        # hrefとisoコードが両方取得できた場合のみデータに追加
        assert href and iso_code

        full_url = "https://ja.wikipedia.org" + str(href)

        print(f"処理中: {iso_code} - {full_url}")

        # 実際にURLを訪問してimgタグを取得
        data.append(fetch_page_images(id, ja, iso_code, full_url))

        # リクエスト間隔を空ける（サーバーに負荷をかけないため）
        time.sleep(0.1)

    # JSONファイルに保存
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    html_path = "src/data/raw/wiki_iso.html"
    assert os.path.exists(html_path), f"{html_path} が存在しません。"
    basename = os.path.basename(html_path)
    json_path = "src/data/geography/wiki.json"
    result = process_html_file(html_path, json_path)
