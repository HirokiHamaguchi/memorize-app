import json
import os
import time
from typing import Dict, List, Tuple

import requests
from bs4 import BeautifulSoup

REQUEST_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
}

OUTPUT_PATH = "src/data/geography/wiki.json"

IMAGE_FILTERS = {
    "position_keywords": [
        "の位置",
        "の位置図",
        "on_the_globe",
        "in_the_world",
        "Location",
        "Taiwan2014.svg",
    ],
    "flag_keywords": ["Flag_of", "Proposed_flag_of"],
    "excluded_flags": ["Flag_of_None.svg.png"],
}

SPECIAL_CASES = {
    "BV": {
        "pos_url": "//upload.wikimedia.org/wikipedia/commons/thumb/3/38/Bouvet-pos.png/250px-Bouvet-pos.png",
        "flag_url": "//upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/250px-Flag_of_Norway.svg.png",
    }
}


class Config:
    def __init__(self, config_path: str = "script/geography/config.json"):
        with open(config_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    @property
    def un_countries(self) -> List[Tuple[str, str]]:
        return [(iso, name) for iso, name in self.data["un_countries"]]

    @property
    def name_fixes(self) -> Dict[str, str]:
        return self.data["name_fixes"]

    @property
    def text_replacements(self) -> List[str]:
        return self.data["text_replacements"]

    @property
    def urls(self) -> Dict[str, str]:
        return self.data["urls"]


class WikiScraper:
    def __init__(self):
        self.config = Config()

    def create_country_emoji(self, iso_code: str) -> str:
        return "".join(chr(0x1F1E6 + ord(c) - ord("A")) for c in iso_code)

    def download_image(self, img_url: str, save_path: str) -> bool:
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

    def resize_image_url(self, url: str, iso: str, is_flag: bool = False) -> str:
        if "/thumb/" in url and url.endswith(".svg.png"):
            if any(px in url for px in ["250px-", "40px-"]):
                for px in ["250px-", "40px-"]:
                    url = url.replace(px, "700px-")
                return url
            elif "120px-" in url:
                return url.replace("120px-", "500px-")
            elif "330px-" in url and not is_flag:
                return url.replace("330px-", "700px-")
            else:
                raise ValueError("画像のサイズ変更失敗")
        elif "/thumb/" in url and url.endswith(".png") and iso == "AT":
            if "250px-" in url:
                return url.replace("250px-", "700px-")
        return url

    def extract_image_urls(self, soup: BeautifulSoup, iso: str) -> Tuple[str, str]:
        if iso in SPECIAL_CASES:
            return SPECIAL_CASES[iso]["pos_url"], SPECIAL_CASES[iso]["flag_url"]

        img_tags = soup.find_all("img")
        pos_url = None
        flag_url = None

        for img in img_tags[:30]:
            alt_text = str(img.get("alt", ""))
            src = str(img.get("src", ""))

            if pos_url is None and any(
                keyword in alt_text or keyword in src
                for keyword in IMAGE_FILTERS["position_keywords"]
            ):
                pos_url = src

            elif flag_url is None and any(
                keyword in src for keyword in IMAGE_FILTERS["flag_keywords"]
            ):
                if not any(
                    excluded in src for excluded in IMAGE_FILTERS["excluded_flags"]
                ):
                    flag_url = src

        if pos_url is None or flag_url is None:
            raise ValueError(f"Required images not found for {iso}")

        return pos_url, flag_url

    def fetch_country_images(self, iso: str, url: str) -> Tuple[str, str]:
        flag_path = f"public/geography/flags/{iso}.png"
        pos_path = f"public/geography/locations/{iso}.png"

        if os.path.exists(flag_path) and os.path.exists(pos_path):
            return flag_path, pos_path

        response = requests.get(url, headers=REQUEST_HEADERS, timeout=100)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        try:
            pos_url, flag_url = self.extract_image_urls(soup, iso)
        except ValueError:
            print(f"画像が見つかりません: {iso} - {url}")
            return "No Image", "No Image"

        pos_url = self.resize_image_url(pos_url, iso, is_flag=False)
        flag_url = self.resize_image_url(flag_url, iso, is_flag=True)

        for img_url, save_path in [(flag_url, flag_path), (pos_url, pos_path)]:
            self.download_image(img_url, save_path)

        return flag_path, pos_path

    def fetch_iso_table_rows(self):
        url = self.config.urls["iso_table"]
        response = requests.get(url, headers=REQUEST_HEADERS, timeout=100)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        table = soup.find("table", class_="wikitable")
        assert table is not None, "対象のテーブルが見つかりません"

        raw_tr_tags = table.find_all("tr")
        return [tr for tr in raw_tr_tags if len(tr.find_all("td")) >= 6]

    def clean_table_cell_text(self, text: str) -> str:
        for replacement in self.config.text_replacements:
            text = text.replace(replacement, "")
        return text.strip()

    def fetch_capitals_data(self) -> List[Dict[str, str]]:
        url = self.config.urls["capitals"]
        response = requests.get(url, headers=REQUEST_HEADERS, timeout=100)
        response.raise_for_status()
        response.encoding = response.apparent_encoding

        soup = BeautifulSoup(response.text, "html.parser")
        target = soup.find(id="一覧")
        if not target:
            raise ValueError("id='一覧' が見つかりません。")

        table = target.find_next("table")
        if not table:
            raise ValueError("id='一覧' の後に table が見つかりません。")

        return self.parse_capitals_table(table)

    def parse_capitals_table(self, table) -> List[Dict[str, str]]:
        capitals = []
        rows = table.find_all("tr")
        headers = [th.get_text(strip=True) for th in rows[0].find_all(["th", "td"])]

        for row in rows[1:]:
            cells = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]
            if len(cells) == len(headers):
                cells = [self.clean_table_cell_text(cell) for cell in cells]
                data_dict = dict(zip(headers, cells))

                if "" in data_dict:
                    data_dict.pop("")

                self.process_capital_data(data_dict)
                capitals.append(data_dict)
            else:
                print(f"警告: 行のセル数がヘッダーと一致しません: {cells}")

        return capitals

    def process_capital_data(self, data_dict: Dict[str, str]):
        if "備考" in data_dict:
            if "最大都市は" not in data_dict["備考"]:
                data_dict.pop("備考")
            elif "「アメリカ合衆国の首都の一覧」も参照" in data_dict["備考"]:
                data_dict["備考"] = (
                    data_dict["備考"]
                    .replace("「アメリカ合衆国の首都の一覧」も参照", "")
                    .strip()
                )

        if "国名" in data_dict:
            name = data_dict["国名"]
            data_dict["国名"] = self.config.name_fixes.get(name, name)

    def process_iso_row(self, tr) -> Tuple[str, str, str]:
        td_tags = tr.find_all("td")
        assert len(td_tags) >= 6, "tdタグが6つ未満です。"

        first_td = td_tags[0]
        last_a = first_td.find_all("a")[-1]
        href = last_a.get("href") if last_a else None
        ja = first_td.get_text().strip()

        sixth_td = td_tags[5]
        code_tag = sixth_td.find("code")
        iso_code = code_tag.get_text().strip() if code_tag else None

        assert href and iso_code, (
            f"データが不完全です: href={href}, iso_code={iso_code}"
        )

        full_url = "https://ja.wikipedia.org" + str(href)
        return ja, iso_code, full_url

    def is_un_member(self, iso_code: str) -> bool:
        return any(iso_code == code for code, _ in self.config.un_countries)

    def validate_country_data(self, iso_code: str, ja: str) -> bool:
        code, name = next((c, n) for c, n in self.config.un_countries if iso_code == c)
        assert ja == name, f"ISOコードと国名が一致しません: {iso_code} - {ja} != {name}"
        return True

    def create_entry(
        self,
        id: int,
        ja: str,
        iso_code: str,
        full_url: str,
        flag_path: str,
        pos_path: str,
        country: Dict[str, str],
    ) -> Dict:
        return {
            "id": id,
            "ja": ja,
            "iso": iso_code,
            "url": full_url.replace("https://ja.wikipedia.org/wiki/", ""),
            "flag": flag_path.replace("public", "/memorize-app"),
            "pos": pos_path.replace("public", "/memorize-app"),
            "emoji": self.create_country_emoji(iso_code),
            "capital": country.get("首都名", ""),
            "note": country.get("備考", ""),
        }

    def generate_country_data(self) -> List[Dict]:
        capitals = self.fetch_capitals_data()
        data = []

        for id, tr in enumerate(self.fetch_iso_table_rows(), start=1):
            ja, iso_code, full_url = self.process_iso_row(tr)
            print(f"処理中: {iso_code} - {ja}")

            if not self.is_un_member(iso_code):
                print("--国連加盟国でないため除外")
                continue

            flag_path, pos_path = self.fetch_country_images(iso_code, full_url)
            if flag_path == "No Image" or pos_path == "No Image":
                print("--画像が不足しているため除外")
                continue

            self.validate_country_data(iso_code, ja)

            country = next((c for c in capitals if c["国名"] == ja), None)
            if ja == "モナコ":
                country = {}
            assert country is not None, f"国名が一致しません: {ja}"

            entry = self.create_entry(
                id, ja, iso_code, full_url, flag_path, pos_path, country
            )
            data.append(entry)

            time.sleep(0.01)

        return data


def main():
    scraper = WikiScraper()
    data = scraper.generate_country_data()

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
