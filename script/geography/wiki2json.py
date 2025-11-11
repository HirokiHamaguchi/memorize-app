import json
import os
import time
from typing import Dict, List

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
assert len(UN_COUNTRIES) == 193, "国連加盟国の数が193ではありません。"

# HTTP リクエストヘッダー
REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/117.0.0.0 Safari/537.36"
}

# 出力ファイルパス
WIKI_JSON_PATH = "src/data/geography/wiki.json"


def create_country_emoji(iso_code: str) -> str:
    """ISOコードから国旗絵文字を生成"""
    return "".join(chr(0x1F1E6 + ord(c) - ord("A")) for c in iso_code)


def download_image(img_url: str, save_path: str) -> bool:
    """画像をダウンロードして保存"""
    if img_url.startswith("//"):
        img_url = "https:" + img_url

    try:
        response = requests.get(img_url, headers=REQUEST_HEADERS, timeout=100)
        response.raise_for_status()
        with open(save_path, "wb") as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"画像のダウンロードに失敗しました: {img_url} - {e}")
        return False


def resize_image_url(url: str, iso: str, is_flag: bool = False) -> str:
    """画像URLのサイズを適切に変更"""
    if "/thumb/" in url and url.endswith(".svg.png"):
        if any(px in url for px in ["250px-", "40px-"]):
            return url.replace("250px-", "700px-").replace("40px-", "700px-")
        elif "120px-" in url:
            return url.replace("120px-", "500px-")
        elif "330px-" in url and not is_flag:
            return url.replace("330px-", "700px-")
        else:
            raise ValueError(f"画像のサイズ変更失敗: {url}")
    elif "/thumb/" in url and url.endswith(".png") and iso == "AT":
        if "250px-" in url:
            return url.replace("250px-", "700px-")
    return url


def fetch_country_images(id: int, ja: str, iso: str, url: str) -> tuple[str, str]:
    """国の画像（国旗・位置図）を取得してダウンロード"""
    flag_path = f"public/geography/flags/{iso}.png"
    pos_path = f"public/geography/locations/{iso}.png"

    # 既に画像が存在する場合はスキップ
    if os.path.exists(flag_path) and os.path.exists(pos_path):
        return flag_path, pos_path

    # Wikipediaページから画像URLを取得
    response = requests.get(url, headers=REQUEST_HEADERS, timeout=100)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    img_tags = soup.find_all("img")

    pos_url = None
    flag_url = None

    if iso == "BV":
        pos_url = "//upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bouvet-pos.png/250px-Bouvet-pos.png"
        flag_url = "//upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/250px-Flag_of_Norway.svg.png"
    else:
        for img in img_tags[:30]:
            alt_text = str(img.get("alt", ""))
            src = str(img.get("src", ""))

            if pos_url is None and (
                alt_text.endswith("の位置")
                or alt_text.endswith("の位置図")
                or "on_the_globe" in src
                or "in_the_world" in src
                or "Location" in src
                or "Taiwan2014.svg" in src
            ):
                pos_url = src

            elif flag_url is None and ("Flag_of" in src or "Proposed_flag_of" in src):
                flag_url = src

    if pos_url is None or flag_url is None or "Flag_of_None.svg.png" in flag_url:
        print(f"画像が見つかりません: {iso} - {url}")
        print(f"  位置: {pos_url} 国旗: {flag_url}")
        return "No Image", "No Image"

    pos_url = resize_image_url(pos_url, iso, is_flag=False)
    flag_url = resize_image_url(flag_url, iso, is_flag=True)

    for img_url, save_path in [(flag_url, flag_path), (pos_url, pos_path)]:
        download_image(img_url, save_path)

    return flag_path, pos_path


def fetch_iso_table_rows():
    """ISO 3166-1のテーブル行を取得"""
    url = "https://ja.wikipedia.org/wiki/ISO_3166-1"
    response = requests.get(url, headers=REQUEST_HEADERS, timeout=100)
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


def clean_table_cell_text(text: str) -> str:
    replacements = ["[注釈 1]", "[注釈 2]", "[注釈 3]", "[1]", "[2]", "[3]"]
    for replacement in replacements:
        text = text.replace(replacement, "")
    return text.strip()


def generate_country_data() -> list[dict]:
    """国家データを生成"""
    url = r"https://ja.wikipedia.org/wiki/%E9%A6%96%E9%83%BD%E3%81%AE%E4%B8%80%E8%A6%A7"
    response = requests.get(url, headers=REQUEST_HEADERS, timeout=100)
    response.raise_for_status()
    response.encoding = response.apparent_encoding

    soup = BeautifulSoup(response.text, "html.parser")

    # 一覧セクションを見つける
    target = soup.find(id="一覧")
    if not target:
        raise ValueError("id='一覧' が見つかりません。")

    table = target.find_next("table")
    if not table:
        raise ValueError("id='一覧' の後に table が見つかりません。")

    capitals: List[Dict[str, str]] = []
    rows = table.find_all("tr")
    headers = [th.get_text(strip=True) for th in rows[0].find_all(["th", "td"])]

    for row in rows[1:]:
        cells = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]
        if len(cells) == len(headers):
            # テキストをクリーンアップ
            cells = [clean_table_cell_text(cell) for cell in cells]

            data_dict = dict(zip(headers, cells))

            # 空の項目を削除
            if "" in data_dict:
                data_dict.pop("")

            # 備考欄の処理
            if "備考" in data_dict:
                if "最大都市は" not in data_dict["備考"]:
                    data_dict.pop("備考")
                elif "「アメリカ合衆国の首都の一覧」も参照" in data_dict["備考"]:
                    data_dict["備考"] = (
                        data_dict["備考"]
                        .replace("「アメリカ合衆国の首都の一覧」も参照", "")
                        .strip()
                    )

            # 国名の正規化
            if "国名" in data_dict:
                name_fixes = {
                    "ミナミアフリカ南アフリカ共和国": "南アフリカ",
                    "ミナミスタン南スーダン": "南スーダン",
                    "チュウカ中華人民共和国": "中華人民共和国",
                    "セキドウ赤道ギニア": "赤道ギニア",
                    "チヨウセン朝鮮民主主義人民共和国": "朝鮮民主主義人民共和国",
                    "チュウオウ中央アフリカ共和国": "中央アフリカ共和国",
                    "ラオス": "ラオス人民民主共和国",
                    "ベネズエラ": "ベネズエラ・ボリバル共和国",
                    "モルドバ": "モルドバ共和国",
                    "ボリビア": "ボリビア多民族国",
                    "ダイカンミンコク大韓民国": "大韓民国",
                    "イラン": "イラン・イスラム共和国",
                    "エスワティニ王国": "エスワティニ",
                    "シリア": "シリア・アラブ共和国",
                    "ニホン日本": "日本",
                    "ヒガシ東ティモール": "東ティモール",
                    "ブルネイ": "ブルネイ・ダルサラーム",
                    "ロシア": "ロシア連邦",
                }
                c_n = data_dict["国名"]
                data_dict["国名"] = name_fixes.get(c_n, c_n)

            capitals.append(data_dict)
        else:
            print(f"警告: 行のセル数がヘッダーと一致しません: {cells}")

    data = []

    for id, tr in enumerate(fetch_iso_table_rows(), start=1):
        td_tags = tr.find_all("td")
        assert len(td_tags) >= 6, "tdタグが6つ未満です。"

        # 1つ目のtdからhref属性と国名を取得
        first_td = td_tags[0]
        last_a = first_td.find_all("a")[-1]  # 最後のaタグを取得
        href = last_a.get("href") if last_a else None
        ja = first_td.get_text().strip()

        # 6つ目のtdから2文字のISOコードを取得
        sixth_td = td_tags[5]
        code_tag = sixth_td.find("code")
        iso_code = code_tag.get_text().strip() if code_tag else None

        assert href and iso_code, (
            f"データが不完全です: href={href}, iso_code={iso_code}"
        )

        full_url = "https://ja.wikipedia.org" + str(href)

        print(f"処理中: {iso_code} - {ja}")

        # 国連加盟国でない場合はスキップ
        if not any(iso_code == code for code, _ in UN_COUNTRIES):
            print("--国連加盟国でないため除外")
            continue

        flag_path, pos_path = fetch_country_images(id, ja, iso_code, full_url)
        if flag_path == "No Image" or pos_path == "No Image":
            print("--画像が不足しているため除外")
            continue

        # ISOコードと国名の整合性をチェック
        code, name = next((c, n) for c, n in UN_COUNTRIES if iso_code == c)
        assert ja == name, f"ISOコードと国名が一致しません: {iso_code} - {ja} != {name}"

        # 首都データをマージ
        country = next((c for c in capitals if c["国名"] == ja), None)
        if ja == "モナコ":
            country = {}
        assert country is not None, f"国名が一致しません: {ja}"

        # データエントリを作成
        entry = {
            "id": id,
            "ja": ja,
            "iso": iso_code,
            "url": full_url.replace("https://ja.wikipedia.org/wiki/", ""),
            "flag": flag_path.replace("public", "/memorize-app"),
            "pos": pos_path.replace("public", "/memorize-app"),
            "emoji": create_country_emoji(iso_code),
            "capital": country.get("首都名", ""),
            "note": country.get("備考", ""),
        }
        data.append(entry)

        # リクエスト間隔を空ける（サーバーに負荷をかけないため）
        time.sleep(0.01)

    return data


def main():
    with open(WIKI_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(generate_country_data(), f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
