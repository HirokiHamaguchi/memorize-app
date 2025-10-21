import json
import os
import time

import requests
from bs4 import BeautifulSoup

# https://www.mofa.go.jp/mofaj/files/000023536.pdf
UN_COUNTRIES = [
    ("AF", "アフガニスタン"),
    ("AL", "アルバニア"),
    ("DZ", "アルジェリア"),
    ("AD", "アンドラ"),
    ("AO", "アンゴラ"),
    ("AG", "アンティグア・バーブーダ"),
    ("AR", "アルゼンチン"),
    ("AM", "アルメニア"),
    ("AU", "オーストラリア"),
    ("AT", "オーストリア"),
    ("AZ", "アゼルバイジャン"),
    ("BS", "バハマ"),
    ("BH", "バーレーン"),
    ("BD", "バングラデシュ"),
    ("BB", "バルバドス"),
    ("BY", "ベラルーシ"),
    ("BE", "ベルギー"),
    ("BZ", "ベリーズ"),
    ("BJ", "ベナン"),
    ("BT", "ブータン"),
    ("BO", "ボリビア多民族国"),
    ("BA", "ボスニア・ヘルツェゴビナ"),
    ("BW", "ボツワナ"),
    ("BR", "ブラジル"),
    ("BN", "ブルネイ・ダルサラーム"),
    ("BG", "ブルガリア"),
    ("BF", "ブルキナファソ"),
    ("BI", "ブルンジ"),
    ("CV", "カーボベルデ"),
    ("KH", "カンボジア"),
    ("CM", "カメルーン"),
    ("CA", "カナダ"),
    ("CF", "中央アフリカ共和国"),
    ("TD", "チャド"),
    ("CL", "チリ"),
    ("CN", "中華人民共和国"),
    ("CO", "コロンビア"),
    ("KM", "コモロ"),
    ("CG", "コンゴ共和国"),
    ("CR", "コスタリカ"),
    ("CI", "コートジボワール"),
    ("HR", "クロアチア"),
    ("CU", "キューバ"),
    ("CY", "キプロス"),
    ("CZ", "チェコ"),
    ("KP", "朝鮮民主主義人民共和国"),
    ("CD", "コンゴ民主共和国"),
    ("DK", "デンマーク"),
    ("DJ", "ジブチ"),
    ("DM", "ドミニカ国"),
    ("DO", "ドミニカ共和国"),
    ("EC", "エクアドル"),
    ("EG", "エジプト"),
    ("SV", "エルサルバドル"),
    ("GQ", "赤道ギニア"),
    ("ER", "エリトリア"),
    ("EE", "エストニア"),
    ("SZ", "エスワティニ"),
    ("ET", "エチオピア"),
    ("FJ", "フィジー"),
    ("FI", "フィンランド"),
    ("FR", "フランス"),
    ("GA", "ガボン"),
    ("GM", "ガンビア"),
    ("GE", "ジョージア"),
    ("DE", "ドイツ"),
    ("GH", "ガーナ"),
    ("GR", "ギリシャ"),
    ("GD", "グレナダ"),
    ("GT", "グアテマラ"),
    ("GN", "ギニア"),
    ("GW", "ギニアビサウ"),
    ("GY", "ガイアナ"),
    ("HT", "ハイチ"),
    ("HN", "ホンジュラス"),
    ("HU", "ハンガリー"),
    ("IS", "アイスランド"),
    ("IN", "インド"),
    ("ID", "インドネシア"),
    ("IR", "イラン・イスラム共和国"),
    ("IQ", "イラク"),
    ("IE", "アイルランド"),
    ("IL", "イスラエル"),
    ("IT", "イタリア"),
    ("JM", "ジャマイカ"),
    ("JP", "日本"),
    ("JO", "ヨルダン"),
    ("KZ", "カザフスタン"),
    ("KE", "ケニア"),
    ("KI", "キリバス"),
    ("KW", "クウェート"),
    ("KG", "キルギス"),
    ("LA", "ラオス人民民主共和国"),
    ("LV", "ラトビア"),
    ("LB", "レバノン"),
    ("LS", "レソト"),
    ("LR", "リベリア"),
    ("LY", "リビア"),
    ("LI", "リヒテンシュタイン"),
    ("LT", "リトアニア"),
    ("LU", "ルクセンブルク"),
    ("MG", "マダガスカル"),
    ("MW", "マラウイ"),
    ("MY", "マレーシア"),
    ("MV", "モルディブ"),
    ("ML", "マリ"),
    ("MT", "マルタ"),
    ("MH", "マーシャル諸島"),
    ("MR", "モーリタニア"),
    ("MU", "モーリシャス"),
    ("MX", "メキシコ"),
    ("FM", "ミクロネシア連邦"),
    ("MC", "モナコ"),
    ("MN", "モンゴル"),
    ("ME", "モンテネグロ"),
    ("MA", "モロッコ"),
    ("MZ", "モザンビーク"),
    ("MM", "ミャンマー"),
    ("NA", "ナミビア"),
    ("NR", "ナウル"),
    ("NP", "ネパール"),
    ("NL", "オランダ"),
    ("NZ", "ニュージーランド"),
    ("NI", "ニカラグア"),
    ("NE", "ニジェール"),
    ("NG", "ナイジェリア"),
    ("MK", "北マケドニア"),
    ("NO", "ノルウェー"),
    ("OM", "オマーン"),
    ("PK", "パキスタン"),
    ("PW", "パラオ"),
    ("PA", "パナマ"),
    ("PG", "パプアニューギニア"),
    ("PY", "パラグアイ"),
    ("PE", "ペルー"),
    ("PH", "フィリピン"),
    ("PL", "ポーランド"),
    ("PT", "ポルトガル"),
    ("QA", "カタール"),
    ("KR", "大韓民国"),
    ("MD", "モルドバ共和国"),
    ("RO", "ルーマニア"),
    ("RU", "ロシア連邦"),
    ("RW", "ルワンダ"),
    ("KN", "セントクリストファー・ネイビス"),
    ("LC", "セントルシア"),
    ("VC", "セントビンセント・グレナディーン"),
    ("WS", "サモア"),
    ("SM", "サンマリノ"),
    ("ST", "サントメ・プリンシペ"),
    ("SA", "サウジアラビア"),
    ("SN", "セネガル"),
    ("RS", "セルビア"),
    ("SC", "セーシェル"),
    ("SL", "シエラレオネ"),
    ("SG", "シンガポール"),
    ("SK", "スロバキア"),
    ("SI", "スロベニア"),
    ("SB", "ソロモン諸島"),
    ("SO", "ソマリア"),
    ("ZA", "南アフリカ"),
    ("SS", "南スーダン"),
    ("ES", "スペイン"),
    ("LK", "スリランカ"),
    ("SD", "スーダン"),
    ("SR", "スリナム"),
    ("SE", "スウェーデン"),
    ("CH", "スイス"),
    ("SY", "シリア・アラブ共和国"),
    ("TJ", "タジキスタン"),
    ("TH", "タイ"),
    ("TL", "東ティモール"),
    ("TG", "トーゴ"),
    ("TO", "トンガ"),
    ("TT", "トリニダード・トバゴ"),
    ("TN", "チュニジア"),
    ("TR", "トルコ"),
    ("TM", "トルクメニスタン"),
    ("TV", "ツバル"),
    ("UG", "ウガンダ"),
    ("UA", "ウクライナ"),
    ("AE", "アラブ首長国連邦"),
    ("GB", "イギリス"),
    ("TZ", "タンザニア"),
    ("US", "アメリカ合衆国"),
    ("UY", "ウルグアイ"),
    ("UZ", "ウズベキスタン"),
    ("VU", "バヌアツ"),
    ("VE", "ベネズエラ・ボリバル共和国"),
    ("VN", "ベトナム"),
    ("YE", "イエメン"),
    ("ZM", "ザンビア"),
    ("ZW", "ジンバブエ"),
]
print(f"国連加盟国数: {len(UN_COUNTRIES)}")
assert len(UN_COUNTRIES) == 193, "国連加盟国の数が193ではありません。"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/117.0.0.0 Safari/537.36"
}


def fetch_page_images(id: int, ja: str, iso: str, url: str):
    flag_path = f"public/geography/flags/{iso}.png"
    pos_path = f"public/geography/locations/{iso}.png"

    if os.path.exists(flag_path) and os.path.exists(pos_path):
        return flag_path, pos_path

    response = requests.get(url, headers=headers, timeout=100)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    img_tags = soup.find_all("img")

    pos = None
    flag = None

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
        elif flag is None and ("Flag_of" in src or "Proposed_flag_of" in src):
            flag = src

    if pos is None or flag is None or "Flag_of_None.svg.png" in flag:
        print(f"画像が見つかりません: {iso} - {url}")
        print(f"  位置: {pos} 国旗: {flag}")
        return "No Image", "No Image"

    if "/thumb/" in pos and pos.endswith(".svg.png"):
        if any(px in pos for px in ["250px-", "330px-", "40px-"]):
            pos = pos.replace("250px-", "700px-")
        elif "120px-" in pos:
            pos = pos.replace("120px-", "500px-")
        else:
            raise ValueError(f"位置画像のサイズ変更失敗: {pos}")
    elif "/thumb/" in pos and pos.endswith(".png") and iso == "AT":
        pos = pos.replace("250px-", "700px-")
    if "/thumb/" in flag and flag.endswith(".svg.png"):
        if "250px-" in flag or "40px-" in flag:
            flag = flag.replace("250px-", "700px-")
        elif "120px-" in flag:
            flag = flag.replace("120px-", "500px-")
        else:
            raise ValueError(f"国旗画像のサイズ変更失敗: {flag}")

    for img_url, save_path in [(flag, flag_path), (pos, pos_path)]:
        if img_url.startswith("//"):
            img_url = "https:" + img_url
        try:
            response = requests.get(img_url, headers=headers, timeout=100)
            response.raise_for_status()
            with open(save_path, "wb") as f:
                f.write(response.content)
        except Exception as e:
            print(f"画像のダウンロードに失敗しました: {img_url} - {e}")
            pass

    return flag_path, pos_path


def fetch_table():
    url = "https://ja.wikipedia.org/wiki/ISO_3166-1"
    response = requests.get(url, headers=headers, timeout=100)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, "html.parser")
    table = soup.find("table", class_="wikitable")
    assert table is not None, "対象のテーブルが見つかりません"
    raw_tr_tags = table.find_all("tr")
    tr_tags = []
    for tr in raw_tr_tags:
        if len(tr.find_all("td")) >= 6:
            tr_tags.append(tr)
    return tr_tags


def make_raw_json(json_path):
    data = []
    for id, tr in enumerate(fetch_table(), start=1):
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

        assert href and iso_code

        full_url = "https://ja.wikipedia.org" + str(href)

        print(f"処理中: {iso_code}")

        # 実際にURLを訪問してimgタグを取得
        flag_path, pos_path = fetch_page_images(id, ja, iso_code, full_url)
        ret = {
            "id": id,
            "ja": ja,
            "iso": iso_code,
            "url": full_url.replace("https://ja.wikipedia.org/wiki/", ""),
            "flag": flag_path.replace("public", "/memorize-app"),
            "pos": pos_path.replace("public", "/memorize-app"),
        }
        data.append(ret)

        # リクエスト間隔を空ける（サーバーに負荷をかけないため）
        time.sleep(0.01)

    # JSONファイルに保存
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def make_json(raw_json, wiki_json):
    with open(raw_json, "r", encoding="utf-8") as f:
        data = json.load(f)

    # dataのうち、flagかposが"No Image"のものを除外
    # また、国連加盟国でないものを除外
    filtered_data = []
    for entry in data:
        if entry["flag"] == "No Image" or entry["pos"] == "No Image":
            print(f"画像が不足しているため除外: {entry['iso']} - {entry['ja']}")
            continue
        if not any(entry["iso"] == code for code, name in UN_COUNTRIES):
            print(f"国連加盟国でないため除外: {entry['iso']} - {entry['ja']}")
            continue
        # check iso and ja match
        code, name = next((c, n) for c, n in UN_COUNTRIES if entry["iso"] == c)
        assert entry["ja"] == name, (
            f"ISOコードと国名が一致しません: {entry['iso']} - {entry['ja']} != {name}"
        )
        # emojiをisoコードから生成
        entry["emoji"] = "".join(chr(0x1F1E6 + ord(c) - ord("A")) for c in entry["iso"])
        filtered_data.append(entry)

    with open(wiki_json, "w", encoding="utf-8") as f:
        json.dump(filtered_data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    raw_json = "src/data/geography/raw_wiki.json"
    wiki_json = "src/data/geography/wiki.json"
    # make_raw_json(raw_json)
    make_json(raw_json, wiki_json)
